openerp.point_of_sale = function(instance) {
    //TODO: This must call supper someway for make it extendible
    instance.point_of_sale = {};

    var module = instance.point_of_sale;

    openerp_pos_db(instance,module);            // import db.js
    openerp_pos_models(instance,module);        // import pos_models.js
    openerp_pos_basewidget(instance,module);    // import pos_basewidget.js
    openerp_pos_keyboard(instance,module);      // import  pos_keyboard_widget.js
    openerp_pos_scrollbar(instance,module);     // import pos_scrollbar_widget.js
    openerp_pos_screens(instance,module);       // import pos_screens.js
    openerp_pos_widgets(instance,module);       // import pos_widgets.js
    openerp_pos_devices(instance,module);       // import pos_devices.js

    // tables
    pos_restaurant_db(instance,module);            // import pos_restaurant_db functions
    pos_restaurant_models(instance,module);        // import pos_restaurant_models
    pos_restaurant_screens(instance,module);       // import pos_restaurant_screens
    pos_restaurant_widgets(instance,module);       // import pos_restaurant_widgets

    instance.web.client_actions.add('pos.ui', 'instance.point_of_sale.PosWidget');
}; 