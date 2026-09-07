// ==========================================
// 3. TODO: HIGHER-ORDER FUNCTION ENGINE (Students write this)
// ==========================================

// TODO: Write "add" callback expression (a, b) => ...

//function add (a,b){return a+b}
const add = (a, b) => {return a + b; }

// TODO: Write "subtract" callback expression (a, b) => ...
const subtract = (a, b) => {return a - b; }


// TODO: Write "multiply" callback expression (a, b) => ...
const multiply = (a, b) => {return a * b; }


// TODO: Write "divide" callback expression (a, b) => ...
// Rule: Guard against division-by-zero! Return an Error or string warning.
const divide = (a, b) => { 
    /*try{
        return a / b;
    } catch (error){
        return -1;
    }*/
   if (b == 0)
    throw new Error("Can not divide by zero")
   return a / b;
}
