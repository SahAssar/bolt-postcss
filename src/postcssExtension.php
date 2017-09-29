<?php

namespace boltabandoned\postcss;

use Bolt\Extension\SimpleExtension;
use Bolt\Asset\File\JavaScript;
use Bolt\Asset\Snippet\Snippet;
use Bolt\Asset\File\Stylesheet;
use Bolt\Controller\Zone;
use Bolt\Asset\Target;
use Silex\ControllerCollection;

use Bolt\Application;

use Symfony\Component\Yaml\Dumper;
use Symfony\Component\Yaml\Parser;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

class postcssExtension extends SimpleExtension
{
    private $PostCSSAssets = [
        'js/bolt-postcss.pkgd.js',
        'js/bolt-postcss.js',
    ];

    private $JSAssets = [
        'js/bolt-uglifyjs.js'
    ];

    /**
     * @param Request $request
     * @param Application $app
     * @return null|RedirectResponse
     */
    public function before(Request $request, Application $app)
    {
        if (!$app['users']->isAllowed('files:theme')) {
            /** @var UrlGeneratorInterface $generator */
            $generator = $app['url_generator'];
            return new RedirectResponse($generator->generate('dashboard'), Response::HTTP_SEE_OTHER);
        }
        return null;
    }

    /**
     * {@inheritdoc}
     */
    protected function registerTwigFunctions()
    {
        return [
            'css' => 'GetCssVariable'
        ];
    }

    public function GetCssVariable(String $name)
    {
        $config = $this->getConfig();
        return $config['variables'][$name];
    }

    /**
     * {@inheritdoc}
     */
    protected function registerBackendRoutes(ControllerCollection $collection)
    {
        $collection->post('/extensions/postcss/updatecssfiles', [$this, 'updateCssFiles'])->before([$this, 'before']);
        $collection->post('/extensions/postcss/updatejsfiles', [$this, 'updateJsFiles'])->before([$this, 'before']);
    }

    protected function subscribe(EventDispatcherInterface $dispatcher)
    {
        $app = $this->getContainer();
        $app->after(function(){
            $this->postcssAssets();
        });
    }

    public function updateJsFiles(Application $app, Request $request)
    {
        $app = $this->getContainer();
        $config = $this->getConfig();
        $newJS = $request->get('processed');
        $newSourcemap = $request->get('sourcemap');

        $app['filesystem']->getFile('theme://' . $config['jsFile'])->put($newJS);
        $app['filesystem']->getFile('theme://' . $config['jsFile'] . '.map')->put($newSourcemap);

        return $app->json(['OK!']);
    }

    public function updateCssFiles(Application $app, Request $request)
    {
        $dumper = new Dumper();
        $parser = new Parser();
        $variables = json_decode($request->get('variables'), true);
        $currentConfig = $app['filesystem']->getFile('config://extensions/postcss.boltabandoned.yml');
        $configArr = $parser->parse($currentConfig->read());
        $configArr['variables'] = $variables;
        $dumper->setIndentation(4);
        $updatedConfig = $dumper->dump($configArr, 9999);
        $currentConfig->put($updatedConfig);

        $app = $this->getContainer();
        $config = $this->getConfig();
        $newCSS = $request->get('processed');
        $newSourcemap = $request->get('sourcemap');

        $app['filesystem']->getFile('theme://' . $config['cssFile'])->put($newCSS);
        $app['filesystem']->getFile('theme://' . $config['cssFile'] . '.map')->put($newSourcemap);

        return $app->json(['OK!']);
    }

    public function postcssAssets()
    {
        $app = $this->getContainer();


        if (($app['request']->get('namespace') === 'theme' ||
            $app['request']->get('namespace') === 'themes') &&
            $app['request']->get('file')) {

            $file = $app['request']->get('file');
            if($app['request']->get('namespace') === 'themes'){
                $file = preg_replace('/^([a-zA-Z0-9_\-]*\/)/', '', $file);
            }

            $conf = array_merge(
                $this->getConfig(),
                [
                    'file' => $file,
                    'backendpath' => trim($app['config']->get('general/branding/path'), '/'),
                    'editPath' => $app['resources']->getURL('bolt') . 'file/edit',
                    'themePath' => '/themes/' . $app['config']->get('general/theme'),
                    'currentPath' => $app['resources']->getURL('current')
                ]
            );

            $extension = pathinfo($app['request']->get('file'), PATHINFO_EXTENSION);

            $queue = [];

            if (($conf['CSSsourceFile'] === $file) && $conf['PostCSS']) {
                $queue = $this->PostCSSAssets;
            } elseif (($conf['JSsourceFile'] === $file) && $conf['UglifyJS']) {
                $queue = $this->JSAssets;
            }

            foreach($queue as $priority=>$assetFile){
                $asset = (new JavaScript($assetFile))
                        ->setZone(Zone::BACKEND)
                        ->setPriority($priority);

                $file = $this->getWebDirectory()->getFile($asset->getPath());
                $asset->setPackageName('extensions')->setPath($file->getPath());

                $app['asset.queue.file']->add($asset);
            }

            $script = '<script>var postCssConfig = '.json_encode($conf).';</script>';

            $asset = (new Snippet())
                  ->setCallback($script)
                  ->setZone(Zone::BACKEND)
                  ->setLocation(Target::END_OF_BODY);
            $app['asset.queue.snippet']->add($asset);
        }
    }
}
