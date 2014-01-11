(function (openerp) {

    openerp.point_of_sale_plugins = openerp.point_of_sale_plugins.extend({
        init: function (instance, module) {
            var self = this;
            // Call original init function
            openerp.point_of_sale_plugins.__super__.init.call(this, instance, module);
            // Call tables initialization
            pos_restaurant_db(instance,module);            // import pos_restaurant_db functions
            pos_restaurant_models(instance,module);        // import pos_restaurant_models
            pos_restaurant_screens(instance,module);       // import pos_restaurant_screens
            pos_restaurant_widgets(instance,module);       // import pos_restaurant_widgets
        }
    });
})(openerp);