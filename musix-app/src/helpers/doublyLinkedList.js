class Nodo {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }
}



class DoublyLinkedList {

    constructor() {
        this.Head = null;
        this.Tail = null;
        this.size = 0;

        this.idPosition = {}//This is to store the IDs of the data and the position in the List.
    }

    getNode(position) {
        if (position >= 0 && position < this.size) {
            let targetNode = this.Head;
            for (let index = 0; index < position; index++) {
                targetNode = targetNode.next
            }
            return { targetNode, data: targetNode.data, error: null };
        } else {
            return { error: `Position: ${position} out of range` }
        }
    }

    insertion_specified(data, position) {

        if (!data._id) {
            throw "The data doesn't have the _id attribute"
        }

        //If position is the same as the size means that the item is going to the end of the list
        if (position === this.size) {
            this.insertion_ending(data)
            return
        }

        let newNode = new Nodo(data)

        //Get the targetNode in the specific position
        let { targetNode, error } = this.getNode(position)

        if (error) {
            return console.log(error)
        }


        //When the List is Empty
        if (this.Head == null) {
            //Update the idPosition object with the new id and its position in the list and update the size of the list as well.
            this.idPosition = { ...this.idPosition, [data._id]: this.size++ }
            this.Head = newNode;
            this.Tail = newNode;
            return
        }

        //update the size of the list.
        this.size++
        //Update the idPosition object with the new id and its position in the list
        this.idPosition = {
            ...this.idPosition,
            [data._id]: position,
            [targetNode.data._id]: position + 1 //Update the position of the targetNode ID in the list
        }

        newNode.next = targetNode
        newNode.prev = targetNode.prev
        targetNode.prev = newNode
    }

    insertion_ending(data) {
        if (!data._id) {
            throw "The data doesn't have the _id attribute"
        }

        let newNode = new Nodo(data);

        //Update the idPosition object with the new id and its position in the list and update the size of the list as well.
        this.idPosition = { ...this.idPosition, [data._id]: this.size++ }

        //When the List is Empty
        if (this.Head == null) {
            this.Head = newNode;
            this.Tail = newNode;
            return
        }

        this.Tail.next = newNode;
        newNode.prev = this.Tail;
        this.Tail = newNode;

    }

    move_node_ending(nodeToMove) {

        if (nodeToMove == this.size - 1) return;

        let { targetNode, error } = this.getNode(nodeToMove)

        if (error) {
            return console.log(error)
        }

        //Move the first node to the end of the list
        if (nodeToMove == 0) {
            targetNode.next.prev = null;
            this.Head = targetNode.next;
            targetNode.prev = this.Tail
            targetNode.next = null
            this.Tail.next = targetNode
            this.Tail = targetNode

            this.update_lists_id(nodeToMove, this.size, targetNode, this.getNode(this.size - 1))
            return
        }

        //Move the any node except the firt node to the end of the list
        targetNode.prev.next = targetNode.next
        targetNode.next.prev = targetNode.prev
        this.Tail.next = targetNode
        targetNode.prev = this.Tail
        targetNode.next = null
        this.Tail = targetNode

        this.update_lists_id(nodeToMove, this.size, targetNode, this.getNode(this.size - 1))

    }


    move_specified(positionNode, newPosition) {//positionNode is the node that will move     //newPosition is where the 'positionNode' will move

        if (positionNode == newPosition) return //It's no necessary make changes.

        let { targetNode, error } = this.getNode(newPosition)

        let Node_positionNode = this.getNode(positionNode)
        let nodeToMove = Node_positionNode.targetNode
        let error1 = Node_positionNode.error1

        if (error || error1) {
            return console.log(error || error1)
        }

        //If position is the same as the size means that the item is going to the end of the list
        if (newPosition === this.size - 1) {
            this.move_node_ending(positionNode)
            return
        }

        if (newPosition == 0) {
            this.delete_node(positionNode)//First delete the Node to be moved

            this.update_lists_id(positionNode, newPosition, nodeToMove, targetNode)

            //Know insert it in the newPosition
            nodeToMove.prev = null
            nodeToMove.next = targetNode
            this.Head = nodeToMove
            return
        }

        this.delete_node(positionNode)


        if (positionNode < newPosition) {
            nodeToMove.next = targetNode.next
            targetNode.next.prev = nodeToMove
            targetNode.next = nodeToMove
        } else if (positionNode > newPosition) {
            nodeToMove.next = targetNode
            targetNode.prev.next = nodeToMove
            targetNode.prev = nodeToMove
        }

        this.update_lists_id(positionNode, newPosition, nodeToMove, targetNode)

    }


    /**
     * Function that update [this.idPositions Object] when the functions that change the positions of the Nodes are executed. 
     * @param {*} positionNode - The position of the node that was moved
     * @param {*} newPosition - The position where the node of the 'positionNode' was moved
     * @param {*} nodeToMove - The Node that was moved
     * @param {*} targetNode - The Node wich gave its position to 'nodeToMove'
     */
    update_lists_id(positionNode, newPosition, nodeToMove, targetNode) {

        //We need to set the limits that indicate which nodes were affected by nodes movement like move node, delete node etc., because only the
        //positions of those nodes need to be updated.
        let upperLimit = (newPosition < positionNode) ? newPosition : positionNode
        let lowerLimit = (newPosition > positionNode) ? newPosition : positionNode

        //I iterate each key of the this.idPositions, with this I can update the specify value of the object
        Object.keys(this.idPosition).map((id, index) => {
            if (index > upperLimit && index < lowerLimit) {//Condition to only accept the nodes that were affected by node movement, like move node, delete node etc.
                if (positionNode < newPosition) {//Case 1
                    this.idPosition[id] = this.idPosition[id] - 1;
                } else {//Case 2
                    this.idPosition[id] = this.idPosition[id] + 1;
                }
            }
        })

        //Now Update the specified nodes that were affected directly
        if (positionNode < newPosition) {//Case 1
            this.idPosition[nodeToMove.data._id] = newPosition
            this.idPosition[targetNode.data._id] = newPosition - 1
        } else if (positionNode > newPosition) {//Case 2
            this.idPosition[nodeToMove.data._id] = newPosition
            this.idPosition[targetNode.data._id] = newPosition + 1
        }

    }

    delete_node(positionNode) {
        let { targetNode, error } = this.getNode(positionNode)

        if (error) {
            throw error
        }

        if (positionNode === 0) {
            this.Head = targetNode.next
            targetNode.next.prev = null
            targetNode.next = null;
            targetNode.prev = null
            return
        }

        //If the positionNode is the end of the list
        if (positionNode === this.size - 1) {
            this.Tail = targetNode.prev
            targetNode.prev.next = null
            targetNode.next = null;
            targetNode.prev = null
            return
        }

        targetNode.next.prev = targetNode.prev
        targetNode.prev.next = targetNode.next;
        targetNode.next = null;
        targetNode.prev = null
    }


    //Check if a specific data exist in the list, return true or false
    exist_data(data) {
        if (!data._id) {
            throw "The data doesn't have the _id attribute"
        }

        let currentNode = this.Head;
        let counter = 0;
        while (currentNode != undefined) {
            if ((currentNode.data._id).toLocaleUpperCase() == (data).toLocaleUpperCase()) {
                return true
            }
            currentNode = currentNode.next
            counter++
        }

        return false;
    }

    clear() {
        this.Head = null;
        this.Tail = null;
        this.size = 0;
        this.idPosition = {}
    }

    //Check if a specific item with Id exist in the list, return the node data and its position
    searchByIdSong(id) {

        let positionNode = this.idPosition[id]
        if (!positionNode && positionNode != 0) {
            return "This item doesn't exist in the List"
        }

        let { data, error } = this.getNode(positionNode)
        if (error) {
            return console.log(error)
        }

        return { data, positionNode };

    }

    //Check if a specific a song with Id exist in the list, return true or false
    hasSong(id) {
        let positionNode = this.idPosition[id]
        if (!positionNode && positionNode != 0) {
            return false
        }

        return true
    }


    forEach(callback) {
        let current = this.Head
        let index = 0;
        while (current){
            callback(current, ++index)
            current = current.next
        }
    }

    clone(){
        let newQueue = new DoublyLinkedList();

        console.log(this)

        this.forEach((node, index)=>{
            newQueue.insertion_ending(node.data)
        })
        
        return newQueue
    }

}


const travese_data = (list) => {
    let counter = 0;
    let copyList = { ...list };
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

export { _doublyLinkedList, travese_data, DoublyLinkedList}