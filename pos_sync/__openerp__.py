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

{
    'name': 'pos_sync',
    'version': '1.0.0',
    'category': 'Point of Sale',
    'summary': 'PoS syncronization plugin',
    'sequence': 7,
    'description': """
Point of Sale syncronization
============================

This module allows you to sincronyze several Point of Sales runing on same database.
    """,
    'author': 'Agustín Cruz Lozano (agustin.cruz@openpyme.mx)',
    'website': 'www.openpyme.mx',
    'license': 'AGPL-3',
    'depends': ['point_of_sale'],
    'installable': True,
    # (Mandatory) Main js file that initializate our extensions
    'js': [
        'static/src/js/pos_sync.js',
        'static/src/js/main.js',
    ],
}
