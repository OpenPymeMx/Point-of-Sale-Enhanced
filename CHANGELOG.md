A. Use the numeric keypad for fast order line entry
This just mimics a regular cash register keypad. Look at the log entry
for details, but briefly: 
It uses the numeric keypad on the keyboard to mimic the keypad found on 
most cash registers. The numbers are used to match a product per its
code, 
and the non-numeric keys are used as modifiers:
'/' - X Quantity
'*' - AMT Manual Price Override
'-' - % - Discount %
'+' - PLU (Product Code)

Examples:
1. Add a product
(code: 100, quantity: 1, Price:list price, no discount)
Cash Register: 100 [PLU]
Numeric Keypad: 100 +

2. Add 9 pieces of a product
(code: 102, quantity: 9, Price: list price, no discount)
Cash Register: 9 [ X ] 102 [PLU]
Numeric Keypad: 9 / 102 +

3. Add 3 pieces of a product and set the price at 9.99
(code: 450, quantity: 3, Price: 9.99, no discount)
Cash Register: 3 [ X ] 9.99 [AMT] 450 [PLU]
Numeric Keypad: 3 / 9.99 * 450 +

4. Add 5 pieces of a product, set price to 23.50, and discount it by 10%
(code: 300, quantity: 5, price: 23.50, discount: 10%)
Cash Register: 5 [ X ] 23.50 [AMT] 10 [% -] 300 [PLU]
Numeric Keypad: 5 / 23.50 * 10 - 300 +

B. When on product list screen focus is set on searchbox by using Ctrl+F shortcut

C. When you search for a product code hitting enter from the search box 
adds the product to the order

D. When payment screen is displayed hitting enter try to validates the
current order

E. Added function keys as shortcuts for payment options so if you press F1
-> First payment option will be set for current order