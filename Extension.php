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
        if ($this->app['config']->getWhichEnd()=='backend'){
            $this->app['twig.loader.filesystem']->prependPath(__DIR__."/twig");
        }
    }
}
