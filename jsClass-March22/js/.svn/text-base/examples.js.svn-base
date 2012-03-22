
var prototypeSample = function(){  

    // define the Person Class  
    function Person() {}  
      
    Person.prototype.walk = function(){  
      alert ('I am walking!');  
    };  
    Person.prototype.sayHello = function(){  
      alert ('hello');  
    };  
      
    // define the Student class  
    function Student() {  
      // Call the parent constructor  
      Person.call(this);  
    }  
      
    // inherit Person  
    Student.prototype = new Person();  
      
    // correct the constructor pointer because it points to Person  
    Student.prototype.constructor = Student;  
       
    // replace the sayHello method  
    Student.prototype.sayHello = function(){  
      alert('hi, I am a student');  
    }  
      
    // add sayGoodBye method  
    Student.prototype.sayGoodBye = function(){  
      alert('goodBye');  
    }  
      
    var student1 = new Student();  
    student1.sayHello();  
    student1.walk();  
    student1.sayGoodBye();  
      
    // check inheritance  
    alert(student1 instanceof Person); // true   
    alert(student1 instanceof Student); // true 
};


// attempt 1
var Person = function(){
    this.name = 'Whatever';
    this.walk = function(){
        console.log('I am walking!');
    };
    this.sayHello = function(){
        console.log('Hello!');
    };
};
Person.prototype.talk = function(){
    console.log('I make talky talky!');
};

var Student = function(){Person.apply(this);};

Student.prototype = new Person();
var Student1 = new Person();
var Student2 = new Student();

try{
    console.log('Student.name: '+Student.name);
}catch(ex){
    console.log('Student name error.');
}

try{
    console.log('Student1.name: '+Student1.name);
}catch(ex){
    console.log('Student1 name error.');
}

try{
    console.log('Student2.name: '+Student2.name);
}catch(ex){
    console.log('Student2 name error.');
}

try{
    console.log('Student2.talk: '+Student2.talk());
}catch(ex){
    console.log('Student2talk error.');
}

// phone example
var phone = function(){
    this.autoDial = [1,2,3,4,5];
    this.number = '000-0000';
    this.call = function(num){
        var callNum = (num == undefined) ? this.autoDial[0] : num;
        console.log('Calling:'+callNum);
    };
}

var rotaryPhone = new phone();
var touchTone = rotaryPhone;

console.log(phone.number);
console.log(rotaryPhone.number);
console.log(touchTone.number);


Object.prototype.inObj = 1;
 
var A = function(){
    this.inA = 2;
};
A.prototype.inAProto = 3;
 
var B = function(){
    this.inB = 4;
};
B.prototype = new A;            // Hook up A into B's prototype chain
B.prototype.constructor = B;
B.prototype.inBProto = 5;
 
var x = new B;
console.log(x.inObj + ', ' + x.inA + ', ' + x.inAProto + ', ' + x.inB + ', ' + x.inBProto);


var a = 2; 
var y = 5; 

(function(){ 
     a = y + 10;      
     var y; 
})();

 console.log(a); 

