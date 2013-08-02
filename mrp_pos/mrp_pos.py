# -*- coding: utf-8 -*-
##############################################################################
#
#    Fedrojesa S.A. de C.V.
#    Copyright (C) 2013 (<http://www.openpyme.mx>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

from openerp.osv import fields, osv
from openerp import tools
from openerp import netsvc

class pos_order(osv.osv):
    """
    Extencion de orden de produccion en Pv
    """
    _name = 'pos.order'
    _inherit = 'pos.order'

    def create_order(self, cr, uid, new_order, partner_id, context = None):
        order_id = super(pos_order, self).create_order(cr, uid, new_order, partner_id, context)
        self._produces(cr, uid, self.pool.get('pos.order').browse(cr, uid, order_id, context), new_order, context)
        return order_id

    def update_order(self, cr, uid, new_order, partner_id, context = None):
        order_id = super(pos_order, self).update_order(cr, uid, new_order, partner_id, context)
        self._produces(cr, uid, self.pool.get('pos.order').browse(cr, uid, order_id, context), new_order, context)
        return order_id

    def _create_mrp(self, cr, uid, bom_id, order, line, production_obj, product_qty, context = None):
        wf_service = netsvc.LocalService("workflow")
        mrp_id = production_obj.create(cr, uid, {
                               'product_id':line.product_id.id,
                               'bom_id':bom_id,
                               'product_uom':line.product_id.uom_id.id,
                               'product_qty':product_qty,
                               'origin':order.name,
                           }, context = None)
        self.pool.get('pos.order.line').write(cr, uid, line.id, {'produced': line.qty }, context)
        wf_service.trg_validate(uid, 'mrp.production', mrp_id, 'button_confirm', cr)
        # production_obj.signal_button_confirm(cr, uid, [mrp_id])
        return True

    def _produces(self, cr, uid, order, new_order, context):
        # TODO: optimizar lineas de codigo
        wf_service = netsvc.LocalService("workflow")
        production_obj = self.pool.get('mrp.production')
        ids = production_obj.search(cr, uid, [('origin', '=', order.name)], context = context)
        records = production_obj.browse(cr, uid, ids, context = context)
        current_lines = []
        new_lines = []
        lines = new_order['lines']
        d = {}

        for line in order.lines:
            # TODO: Find other way to find bom_id
            bom_id = self.pool.get('mrp.bom')._bom_find(cr, uid, line.product_id.id, line.product_id.uom_id.id)
            if bom_id and (line.produced < line.qty):
                self._create_mrp(cr, uid, bom_id, order, line, production_obj, (line.qty - line.produced), context)
                # TODO: Check send signal of alert(imposible_cancel) for ordern in produccion

            for select_production in records:
                d = {'product_id':select_production.product_id.id,
                    'bom_id':select_production.bom_id.id,
                    'product_uom':select_production.product_id.uom_id.id,
                    'product_qty':select_production.product_qty,
                    'origin':select_production.name,
                    'id':select_production.id}
                current_lines.append(d)
                # old way to do
                if (select_production.product_id.id == line.product_id.id) and (select_production.state not in ('done', 'cancel')) and (bom_id and line.produced > line.qty):
                    # production_obj.signal_button_cancel(cr, uid, [select_production.id])
                    wf_service.trg_validate(uid, 'mrp.production', select_production.id, 'button_cancel', cr)
            if bom_id and line.produced > line.qty:
                self._create_mrp(cr, uid, bom_id, order, line, production_obj, line.qty, context)

        # make algorit of cleaner production
        for line_ in lines:
            new_lines.append(line_[2])

        dic_lines_pos = self.get_dic(new_lines, 'product_id')
        dic_mrp = self.get_dic(current_lines, 'product_id')
        x = set(dic_lines_pos)
        y = set(dic_mrp)
        z = y - x
        if z:
            for element in z:
                # production_obj.signal_button_cancel(cr, uid, [ dic_mrp[element]['id'] ])
                wf_service.trg_validate(uid, 'mrp.production', dic_mrp[element]['id'], 'button_cancel', cr)
        return True

pos_order()

class pos_order_line(osv.osv):

    _name = 'pos.order.line'
    _inherit = 'pos.order.line'

    _columns = {
                'produced': fields.integer('produced', digits = (16, 2)),
                }

    _defaults = {
                'produced': lambda *a: 0,
                 }
pos_order_line()

