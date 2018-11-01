function Node(data) {
  this.data = data;
  this.next = null;
}

function LinkedList(){
  this.head = null;
  this.insert = insert;
  this.print = print;
}


/**
function to print the LinkedList
**/
function print(head){
  var temp = this.head;
  while(temp!=null){
    console.log(temp.data);
    temp = temp.next;
  }
}

function insert(value){
  if(this.head==null){
    this.head = new Node(value);;
    return this.head;
  }

  var temp = this.head;
  while(temp.next!=null){
    temp = temp.next;
  }

  temp.next = new Node(value);
  return this.head;
}

var linkedList = new LinkedList();
linkedList.insert(10);
linkedList.insert(20);
linkedList.insert(30);
linkedList.print(linkedList);
