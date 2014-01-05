openerp.extend_pos = function(instance){
	
	// We need to initthe point_of_sale model to append our custom widgets
	module = instance.point_of_sale;
	
    /**
     * Custom code for init a simple widget that add a new button
     * 
     */
	module.testWidget = module.PosBaseWidget.extend({
		template: 'testWidget',
		renderElement: function() {
			console.log('rendering testWidget');
		        var self = this;
		        this._super();             
		        var button = new module.prodButtonWidget(self,{
		            pos: self.pos,
		            pos_widget : self.pos_widget,                    
		        });
		        button.appendTo(self.$el);
		    }
	});
	
	/**
	 * This method is the one that load & render all the PoS widgets
	 * for display our new widget we need to override the original one. 
	 */
	module.PosWidget = module.PosWidget.extend({
		build_widgets: function() {
			this._super();
	        this.test = new module.testWidget(this);
	        this.test.replace($('#placeholder-testWidget'));			
		}
	});
};