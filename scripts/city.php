<?php
    require "aps/2/runtime.php";
    /**
    * @type("http://myweatherdemo.com/city/1.0")
    * @implements("http://aps-standard.org/types/core/resource/1.0")
    */
    class city extends \APS\ResourceBase    
    {
        /**
         * @link("http://myweatherdemo.com/company/1.1")
         * @required
         */
        public $company;
    }
?>