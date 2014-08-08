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
    'name': 'Point of Sale Tables',
    'version': '1.0.0',
    'category': 'Point Of Sale',
    'sequence': 8,
    'summary': 'Restaurant required addons for PoS',
    'description': """
PoS addons for Restaurants
===========================

This module adds aditiona features needed for manage restaurants from PoS
It is compatible with all PC tablets and the iPad, offering multiple payment methods. 

Main Features
-------------
* Add tables for track Orders

    """,
    'author': 'OpenPyme',
    'website': 'www.openpyme.mx',
    'images': [
        'images/cash_registers.jpeg',
        'images/pos_analysis.jpeg',
        'images/register_analysis.jpeg',
        'images/sale_order_pos.jpeg',
        'images/product_pos.jpeg'
    ],
    'depends': [
        'point_of_sale'
    ],
    'data': [
        'security/ir.model.access.csv',
        'data/point_of_sale_view.xml',
        'data/point_of_sale_data.xml',
    ],
    'demo': [
    ],
    'test': [
    ],
    'js': [
        'static/src/js/db.js',
        'static/src/js/models.js',
        'static/src/js/widgets.js',
        'static/src/js/screens.js',
        'static/src/js/main.js',
    ],
    'css': [
        'static/src/css/pos_tables.css',
    ],
    'qweb': [
        'static/src/xml/pos_restaurant.xml'
    ],
    'auto_install': False,
    'installable': True,
    'application': False,
}
