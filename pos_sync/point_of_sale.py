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
import time

from openerp.osv import fields, osv

_logger = logging.getLogger(__name__)

class pos_order(osv.osv):
    _name = "pos.order"
    _inherit = "pos.order"

    _columns = {
        'sync_key': fields.integer('Sincronization key', required=True, readonly=True),
    }

    _defaults = {
        'sync_key': 0,
    }

    def update_pos(self, cr, uid, order, context=None):
        """ Make sincronization between different PoS 
            working on same database
        """
        _logger.debug("Update order: %r" % order)
        # forder => Frontend order
        forder = order['data']

        if 'order_id' in forder:
            # border => Backend order
            border = self.browse(cr, uid, forder['order_id'], context=context)
            # If backend order is done return delete_order
            if border.state in ['done', 'paid']:
                _logger.debug('Order %s is done' % border.id)
                return 'DELETE_ORDER'
            # If sync_key not equal return bad_sync
            if (('sync_key' in forder) and (forder['sync_key'] != border.sync_key)):
                _logger.debug('Order %s get bad syncro key' % border.id)
                return 'BAD_SYNC_KEY'

        # If still here we are getting an order that must be
        # saved on database so we use create_from_ui for do it
        order_id = self.create_from_ui(cr, uid, [order], context)
        new_key = self._generate_sync_key(cr, uid, order_id, context)
        return (new_key, order_id[0])

    def _generate_sync_key(self, cr, uid, id, context=None):
        """ Generate a syncronization key for PoS orders
        """
        # Generate synckey as timestamp number
        synckey = int(time.time())
        # Write key on backend
        self.write(cr, uid, id, {'sync_key': synckey}, context)
        return synckey
