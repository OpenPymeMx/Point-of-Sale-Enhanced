# -*- coding: utf-8 -*-

{
    'name': 'extend_pos',
    'version': '1.0',
    'category': 'Point of Sale',
    'sequence': 7,
    'description': """Simple module that ilustrate the correct way to extend the PoS module""",
    'author': 'Agustín Cruz Lozano (atin81@gmail.com)',
    'website': 'www.openpyme.mx',
    'license': 'AGPL-3',
    'depends': ['point_of_sale'],
    'installable': False,
    # (Optional) List of custom css files for our PoS extension
    'css': [
        'static/src/css/exted_pos.css'
    ],
    # (Mandatory) Main js file that initializate our extensions
    'js': [
        'static/src/js/extend_pos.js',
    ],
    # (Mandatory) Must be used to define the templates for render our extensions
    'qweb': [
        'static/src/xml/extend_pos.xml',
    ],
}