// this file contains the screens definitions. Screens are the
// content of the right pane of the pos, containing the main functionalities. 

function pos_restaurant_screens (instance, module){
    // Setting Use strict
    "use strict";
    
    module.TableScreenWidget = module.ScreenWidget.extend({
        template:     'TableScreenWidget',

        next_screen:  'products',

        show_numpad:     true,
        show_leftpane:   true,

        start: function(){
            var self = this;

            this.table_list_widget = new module.TableListWidget(this,{
                click_table_action: function(table){
                    self.pos.get('selectedOrder').setTable(table);
                },
                table_list: this.pos.db.get_table_list()
            });
            this.table_list_widget.replace($('.placeholder-TableListWidget'));
        }
    });
}