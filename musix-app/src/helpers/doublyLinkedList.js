class Nodo{
    constructor(data){
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}



class DoublyLinkedList{

    constructor(){
        this.Head = null;
        this.Tail = null;
        this.size = 0;
        
        this.idPosition = {}//This is to store the ID of the data and the position in the List.
    }

    getNode(position){
        if(position >= 0 && position < this.size){
            let targetNode = this.Head;
            for (let index = 0; index < position; index++) {
                targetNode = targetNode.next
            }
            return {targetNode, data:targetNode.data, error:null};
        }else{
            return {error : `Position: ${position} out of range`}
        }
    }

    insertion_ending(data){
        let newNode = new Nodo(data);

        
        this.idPosition = {...this.idPosition, [data._id]:this.size++}
        

        if(this.Head == null){
            this.Head = newNode;
            this.Tail = newNode;
        }else{
            this.Tail.next = newNode;
            newNode.prev = this.Tail;
            this.Tail = newNode;
        }

    }

    move_node_ending(nodeToMove){

        if(nodeToMove == this.size - 1) return;

        let {targetNode, error} = this.getNode(nodeToMove)  

        if(error) {
            return console.log(error)
        }

        if(nodeToMove == 0){
            targetNode.next.prev = null;
            this.Head = targetNode.next;
            targetNode.prev = this.Tail
            targetNode.next = null
            this.Tail.next = targetNode
            this.Tail = targetNode

        }else{
            targetNode.prev.next = targetNode.next
            targetNode.next.prev = targetNode.prev
            this.Tail.next = targetNode
            targetNode.prev = this.Tail
            targetNode.next = null
            this.Tail = targetNode
        }

       
    }

    exist_data(data){
        let currentNode = this.Head;
        let counter = 0;
        while(currentNode != undefined){
            if((currentNode.data._id).toLocaleUpperCase() == (data).toLocaleUpperCase()){
                return true
            }
            currentNode = currentNode.next
            counter++
        }

        return false;
    }

    clear(){
        this.Head = null;
        this.Tail = null;
        this.size = 0;
    }

    searchByIdSong(id){

        let positionNode = this.idPosition[id]
        if(!positionNode && positionNode != 0){
            return "This song doesn't exist in the List"
        }

        let {data, error} = this.getNode(positionNode)
        if(error) {
            return console.log(error)
        }

        return {data, positionNode};

    }

}


const travese_data = (list) => {
    let counter = 0;
    let copyList = {...list};
    while (copyList.Head != undefined) {
        console.log(counter, ": ", copyList.Head.data, "\n")
        copyList.Head = copyList.Head.next;
        counter++;
    }
}

/**
 * This will be the 'Queue'
 */
let _doublyLinkedList = new DoublyLinkedList();

export {_doublyLinkedList, travese_data}