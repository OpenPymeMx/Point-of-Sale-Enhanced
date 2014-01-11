/*
 * This a light framework for create Point of Sales plugins
 * is based on the article founded on
 * http://www.9bitstudios.com/2013/06/extending-backbone-js/
 * 
 * TODO: Will be nice if we could extend the framework with this supper plugin
 * https://github.com/lukasolson/backbone-super/blob/master/backbone-super/backbone-super.js
 */
(function (openerp) {
    
    openerp.point_of_sale_plugins = Backbone.PoSPlugin.extend({
        init: function (instance, module) {
            openerp_pos_db(instance,module);         // import db.js
        
            openerp_pos_models(instance,module);     // import pos_models.js
        
            openerp_pos_basewidget(instance,module); // import pos_basewidget.js
        
            openerp_pos_keyboard(instance,module);   // import  pos_keyboard_widget.js
        
            openerp_pos_scrollbar(instance,module);  // import pos_scrollbar_widget.js
        
            openerp_pos_screens(instance,module);    // import pos_screens.js
            
            openerp_pos_widgets(instance,module);    // import pos_widgets.js
        
            openerp_pos_devices(instance,module);    // import pos_devices.js
        }
    });
    
})(openerp);

/*
 * Main function to initializate all javascript needed for 
 * create the Point of Sale interface 
 * This function is calling by OpenERP on PoS initialization
 */
openerp.point_of_sale = function(instance) {
   
    instance.point_of_sale = {};

    var module = instance.point_of_sale,
        plugabble_pos = new openerp.point_of_sale_plugins();
        
    // We use our extendible function to init point of sale
    plugabble_pos.init(instance, module);

    instance.web.client_actions.add('pos.ui', 'instance.point_of_sale.PosWidget');
};
