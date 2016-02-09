<?php

namespace Bolt\Extension\sahassar\postcss;

class Extension extends \Bolt\BaseExtension
{
    public function getName()
    {
        return 'postcss';
    }

    function initialize()
    {
        if (!isset($this->config['use_relative_js_path'])){
            $this->config['use_relative_js_path'] = true;
        }
        if ($this->app['config']->getWhichEnd()=='backend'){
            $this->app['twig.loader.filesystem']->prependPath(__DIR__."/twig");
        }
    }
}
