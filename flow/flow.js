//
// 2015.06.18  --  flow.js
//


// 
// import flow from 'flow.js'
// 
// var a = {a:1,b:2}
// var b = {x:3,y:4}
// 
// flow(a,'a').to(b,'x')
// a.a = 10
//
// flow(a,'b').as('e').to(b)  // change default name
//
 
// upg: test logic (does this behave as we expect?) -- create test jig

// upg: allow function call to change name and such. (create create a method for it)

// upg: method to change default name in chain?

// upg: .as('bob') // rename

// upg: how to stop flows
//
//	var f = flow(a,'a').to(b,'x')
//      f.clear() // and // f.clear(b,'x')   // clear connections.
//
//	f.close() // stop all
//      delete f
//
//	also maybe
//
//	flow(a,'a').clear(b,'x')  // finds thru serach?
//

// see flux zold (looks like we put objects in a list to create objectID for indexing)
 
var flow = function(){

	var sourceObj
	var memberName
	var as

	var list = []

	var here = this


	var update = function(){
			var val = sourceObj[memberName]
			list.forEach(v=>{
				var obj = v.obj
				var member = v.member
				if(typeof(obj) == 'function'){
					var r = obj.call(here,val)
					if(typeof(r) != 'undefined')
						val = r
					}//if
				v.obj[v.member] = val
				})//foreach
		}//func

	var onChange = function(l){
		l.forEach(v=>{
			var name = v.name
			if(name == memberName){
				var type = v.type  //upg: handle delete and add
				var val = sourceObj[name]
				update()
				}//if
			})
		}//onchange


	this.init = function(){
		sourceObj = arguments[0]
		memberName = arguments[1]
		as = memberName
		Object.observe(sourceObj,onChange)
		return this
		}//func

/*
	this.between = function(destObj,destName){ // upg: code this.  .. automatic from/to connection
		if(typeof(destName) == 'undefined')
			destName = memberName

		this.to(destObj,destName)
		_flow(destObj,destName).to(this,memberName)
		}
*/

	this.to = function(destObj,destName){ //upg: limit duplicate mappings? (obj/name)
		if(typeof(destName) == 'undefined')
			destName = as

		list.push({'obj':destObj,'member':destName})
		
		update()

		return this
		}//func

	this.as = function(a){
		as = a
		return this
		}//func

	this.clear = function(a,b){ //upg: selective clear
		list = []
		return this
		}//func

	this.close = function(){
		this.clear()
		Object.unobserve(sourceObj,onChange);
		return this
		}

	}//func


var _flow =  function(){
	var f = new flow()
	f.init.apply(this,arguments)
	return f
}//func

export default function(){
	return _flow.apply(this,arguments)
	}
