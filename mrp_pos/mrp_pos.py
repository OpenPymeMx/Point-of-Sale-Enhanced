import openerp.addons.decimal_precision as dp
from openerp.osv import fields, osv
from openerp.tools import float_compare
from openerp.tools.translate import _
from openerp import netsvc
from openerp import tools

class pos_order(osv.osv):
    """
    Extencion de orden de produccion en Pv
    """
    _name = 'pos.order'
    _inherit = 'pos.order'
    
    def create_order(self, cr, uid, order, partner_id, context = None):        
        order_id = super(pos_order, self).create_order(cr, uid, order, partner_id, context)
        self._produces(cr, uid, self.pool.get('pos.order').browse(cr, uid, order_id, context), context)        
        return order_id  
    
    def update_order(self, cr, uid, order, partner_id, context = None):        
        order_id = super(pos_order, self).update_order(cr, uid, order, partner_id, context)
        self._produces(cr, uid, self.pool.get('pos.order').browse(cr, uid, order_id, context), context)        
        return order_id
    
    def _produces(self, cr, uid, order, context = None):    
        for line in order.lines:
            bom_id = self.pool.get('mrp.bom')._bom_find(cr,uid,line.product_id.id,line.product_id.uom_id.id)            
            if bom_id:
                if line.produced < line.qty:                    
                    mrp_obj = self.pool.get('mrp.production').create(cr, uid, {
                                   'product_id':line.product_id.id,                                                        
                                   'bom_id':bom_id,
                                   'product_uom':line.product_id.uom_id.id,
                                   'product_qty':line.qty - line.produced
                               },context=None)                   
                    #actuliza produce y realiza picking
                    self.pool.get('pos.order.line').write(cr, uid, line.id, {'produced': line.produced + (line.qty - line.produced)}, context)                    
                    temp = self.pool.get('mrp.production').browse(cr,uid,mrp_obj)
                    self.pool.get('mrp.production').action_confirm(cr, uid, [temp.id], context)                    
                else:                    
                    if line.produced > line.qty:
                        #TODO: Check if is possible to reduce the quantity
                        return false                                           
        return True    
        
    
pos_order()
#********************************************************************cambio******************************************************** 
class pos_order_line(osv.osv):
    
    _name = 'pos.order.line'
    _inherit = 'pos.order.line'
    
    _columns = {
                'produced': fields.integer('produced', digits=(16, 2)),                
                }
    _defaults = {
                'produced': lambda *a: 0,                 
                 }                
pos_order_line()

