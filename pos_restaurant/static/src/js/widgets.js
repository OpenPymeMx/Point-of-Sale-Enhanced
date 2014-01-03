function pos_restaurant_widgets (instance, module) {
    // Setting Use strict
    "use strict";
    
	// We need to initthe point_of_sale model to append our custom widgets
	var qweb = instance.web.qweb;

	// Widget for display table list
    module.TableListWidget = module.PosBaseWidget.extend({
        template:'TableListWidget',
        init: function(parent, options) {
            var self = this;
            this._super(parent,options);
            this.model = options.model;
            this.tablewidgets = [];
            this.next_screen = options.next_screen || false;
            this.click_table_action = options.click_table_action;

            this.click_table_handler = function(event){
                var table = self.pos.db.get_table_by_id(this.dataset['tableId']);
                options.click_table_action(table);
            };

            this.table_list = options.table_list || [];
            this.table_cache = {};
        },
        set_table_list: function(table_list){
            this.table_list = table_list;
            this.renderElement();
        },
        replace: function($target){
            this.renderElement();
            var target = $target[0];
            target.parentNode.replaceChild(this.el,target);
        },

        render_table: function(table){
            if(!this.table_cache[table.id]){
                var table_html = qweb.render('Table',{ 
                        widget:  this, 
                        table: table
                    }),
                    table_node = document.createElement('div');
                
                table_node.innerHTML = table_html;
                table_node = table_node.childNodes[1];
                this.table_cache[table.id] = table_node;
            }
            return this.table_cache[table.id];
        },

        renderElement: function() {
            var self = this,
                el_str  = qweb.render(this.template, {widget: this}),
                
            el_node = document.createElement('div');
            el_node.innerHTML = el_str;
            el_node = el_node.childNodes[1];

            if(this.el && this.el.parentNode){
                this.el.parentNode.replaceChild(el_node,this.el);
            }
            this.el = el_node;

            var list_container = el_node.querySelector('.table-list');
            for(var i = 0, len = this.table_list.length; i < len; i++){
                var table_node = this.render_table(this.table_list[i]);
                table_node.addEventListener('click',this.click_table_handler);
                list_container.appendChild(table_node);
            };
        },
    });
	
	/**
	 * This method is the one that load & render all the PoS widgets
	 * for display our new widget we need to override the original one. 
	 */
	module.PosWidget = module.PosWidget.extend({
		build_widgets: function() {
			this._super();
			
            // -------- Load Screens ---------

            this.table_screen = new module.TableScreenWidget(this,{});
            this.table_screen.appendTo($('#rightpane'));
            
            // -------- Screen Selector ---------
            this.screen_selector.screen_set.tables = this.table_screen;
            this.screen_selector.default_cashier_screen = 'tables';
		}
	});
};