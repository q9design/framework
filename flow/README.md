

# define live data relationships

```javascript
import flow from 'flow.js'
 
var a = {a:1,b:2}
var b = {x:3,y:4}
 
flow(a,'a').to(b,'x')    // define relationship
a.a = 10                 // b.x will be 10 also

```
