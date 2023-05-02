class Pathfinder {

    static getCurrentShortestNode(tableOfPaths, nodeList) {
        let shortestPath = Infinity;
        let currentNode = null;

        // For every unvisited node
        for (let i = 0; i < nodeList.length; i++) {
            // If the current node we are looking at has a shorter distance than what we have so far
            if (tableOfPaths.shortestPath[tableOfPaths.node.indexOf(nodeList[i])] < shortestPath) {
                // Set our current shortest node to our current node
                currentNode = nodeList[i];
            }
        }

        // Return the shortest node we found (or null)
        return currentNode;
    }

    static getNodeWithCoord(x, y, nodeList) {
        // For every node in the list
        for (let i = 0; i < nodeList.length; i++) {
            // Check to see if its the one we are looking for
            if (nodeList[i].x === x && nodeList[i].y === y) {
                // It is!
                return nodeList[i];
            }
        }
        // If we got here, we did not find the node
        return null;
    }

    static getUnvisitedNeighbors(node, unvisitedNodes) {
        let validNeighbors = [];
        // For each neighbor that node has
        for (let i = 0; i < node.connections.length; i++) {
            // Get the actual tile info
            let currentNeighbor = Pathfinder.getNodeWithCoord(node.connections[i].x, node.connections[i].y, unvisitedNodes);
            // If we found something in the unvisited nodes list
            if (currentNeighbor !== null) {
                // Then add it to the list of valid neighbors
                validNeighbors.push(currentNeighbor);
            }
        }

        // Give back the list of valid neighbors
        return validNeighbors;
    }

    static getPath(startingTile, targetTile, map) {
        // Generate Unvisited Nodes
        let unvisitedNodes = map;
        // Don't forget to add in the starting node
        unvisitedNodes.push(startingTile);

        let visitedNodes = [];

        let tableOfPaths = {};
        tableOfPaths.node = [];
        tableOfPaths.shortestPath = [];
        tableOfPaths.previousNode = [];
        
        // For each node
        for (let i = 0; i < unvisitedNodes.length; i++) {
            // Add the node to the table
            tableOfPaths.node.push(unvisitedNodes[i]);
            // Add its shortest path and set it to infinity
            tableOfPaths.shortestPath.push(Infinity);
            // Add the a null previous node to the previous node
            tableOfPaths.previousNode.push(null);
        }

        // Find the starting node
        let startingNodeIndex = tableOfPaths.node.indexOf(startingTile);

        // Set its shortest path to 0
        tableOfPaths.shortestPath[startingNodeIndex] = 0;

        /* console.log("Table of Paths");
        console.log(tableOfPaths); */

        // While we still have nodes to search
        while (unvisitedNodes.length > 0) {
            // Find the node with the current shortest path that we have not yet visited
            let currentShortestNode = Pathfinder.getCurrentShortestNode(tableOfPaths, unvisitedNodes); 
            
            let validNeighbors = Pathfinder.getUnvisitedNeighbors(currentShortestNode, unvisitedNodes);

            // The distance taken to our current node
            let distanceToCurrentNode = tableOfPaths.shortestPath[tableOfPaths.node.indexOf(currentShortestNode)];

            for (let i = 0; i < validNeighbors.length; i++) {
                // The distance on the table to our valid neighbor
                let currentNeighborDistance = tableOfPaths.shortestPath[tableOfPaths.node.indexOf(validNeighbors[i])];

                // If the distance to our current node + 1 (the distance to all neighbors) is shorter than on the table
                if (distanceToCurrentNode + 1 < currentNeighborDistance) {
                    // We have found a shorter distance to this node
                    // Update the paths table what our new distance is
                    tableOfPaths.shortestPath[tableOfPaths.node.indexOf(validNeighbors[i])] = distanceToCurrentNode + 1;
                    // Update the paths table what our new previous node is
                    tableOfPaths.previousNode[tableOfPaths.node.indexOf(validNeighbors[i])] = currentShortestNode;
                }
            }

            // After visiting all the neighbors, add our current node to the visited list
            visitedNodes.push(currentShortestNode);

            // And remove the node from our unvisited list
            let removeAtIndex = unvisitedNodes.indexOf(currentShortestNode);
            // Do this check for safety reasons
            if (removeAtIndex > -1) {
                unvisitedNodes.splice(removeAtIndex, 1);
            }
        }

        console.log("Graph");
        return tableOfPaths;
    }
}