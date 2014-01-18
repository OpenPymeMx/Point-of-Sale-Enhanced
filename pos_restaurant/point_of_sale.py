# -*- coding: utf-8 -*-
###########################################################################
#    Module Writen to OpenERP, Open Source Management Solution
#
#    Copyright (c) 2013 OpenPyme - http://www.openpyme.mx/
#    All Rights Reserved.
#    Coded by: Agustín Cruz (agustin.cruz@openpyme.mx)
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

import logging

from openerp.osv import osv, fields
from openerp.tools.translate import _

_logger = logging.getLogger(__name__)


class pos_tables(osv.osv):
    _name = "pos.tables"
    _description = _("Restaurant Tables for PoS orders")
    _columns = {
        'name': fields.char(_('Table Name'), size=64, required=True),
        'company_id': fields.many2one('res.company', _('Company'), required=False),
        'capacity': fields.integer(_('Capacity')),
    }
    _defaults = {
        'company_id': lambda s, cr, uid, c: s.pool.get('res.company')._company_default_get(cr, uid, 'pos.tables', context=c),
    }


class pos_order(osv.osv):
    _inherit = 'pos.order'
    _columns = {
        'table_id': fields.many2one('pos.tables', _('Table'), required=False)
    }

    def create_order(self, cr, uid, order, partner_id, context=None):
        order_id = super(pos_order, self).create_order(cr,
                                                       uid,
                                                       order,
                                                       partner_id,
                                                       context)

        if 'table_id' in order:
            self.write(cr, uid, order_id, {
                    'table_id': order['table_id'],
                    }, context)

        return order_id

    def update_order(self, cr, uid, order, partner_id, context=None):
        super(pos_order, self).update_order(cr,
                                            uid,
                                            order,
                                            partner_id,
                                            context)

        if ('order_id' in order and 'table_id' in order):
            self.write(cr, uid, order['order_id'], {
                           'table_id': order['table_id'] or False,
                           }, context)
        return order['order_id']
