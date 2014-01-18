(function (openerp) {
    'use strict';
    
    // Add basic functions to point_of_sale_plugins
    var plugins = openerp.point_of_sale_plugins; 
    plugins.addInitFunction(pos_restaurant_db);
    plugins.addInitFunction(pos_restaurant_models);
    plugins.addInitFunction(pos_restaurant_screens);
    plugins.addInitFunction(pos_restaurant_widgets);

})(openerp);