/*
 * This a light framework for create Point of Sales plugins
 * is based on the article founded on
 * http://stackoverflow.com/questions/4578424/javascript-extend-a-function
 * 
 */
(function (openerp) {
    'use strict';
    
    openerp.point_of_sale_plugins = (function(){
        var publicSymbols = {},
            initfunctions = [];
    
        function init(instance, module) {
            var funcs = initfunctions,
                index = 0;
    
            initfunctions = undefined;
    
            for (index = 0; index < funcs.length; ++index) {
                try { 
                    funcs[index](instance, module); 
                } 
                catch (e) { 
                    console.log('Error procesing function: '+funcs[index]);
                    console.log(e);
                }
            }
        }
        publicSymbols.init = init;
    
        function addInitFunction(f) {
            if (initfunctions) {
                // Init hasn't run yet, rememeber it
                initfunctions.push(f);
            }
            else {
                // `init` has already run, call it almost immediately
                // but *asynchronously* (so the caller never sees the
                // call synchronously)
                console.log('Error: adding init functions when PoS is already inited');
                setTimeout(f, 0);
            }
        }
        publicSymbols.addInitFunction = addInitFunction;
    
        return publicSymbols;
    })();
    
    // Add basic functions to point_of_sale_plugins
    var plugins = openerp.point_of_sale_plugins; 
    plugins.addInitFunction(openerp_pos_db);
    plugins.addInitFunction(openerp_pos_models);
    plugins.addInitFunction(openerp_pos_basewidget);
    plugins.addInitFunction(openerp_pos_keyboard);
    plugins.addInitFunction(openerp_pos_scrollbar);
    plugins.addInitFunction(openerp_pos_screens);
    plugins.addInitFunction(openerp_pos_widgets);
    plugins.addInitFunction(openerp_pos_devices);
    
})(openerp);


/*
 * Main function to initializate all javascript needed for 
 * create the Point of Sale interface 
 * This function is calling by OpenERP on PoS initialization
 */
openerp.point_of_sale = function(instance) {
    'use strict';
    
    instance.point_of_sale = {};

    var module = instance.point_of_sale;
        
    // We use our extendible function to init point of sale
    openerp.point_of_sale_plugins.init(instance, module);

    instance.web.client_actions.add('pos.ui', 'instance.point_of_sale.PosWidget');
};
