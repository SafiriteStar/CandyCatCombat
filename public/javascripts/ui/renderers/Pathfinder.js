class Pathfinder {
    static getMapNeighbor(neighborData, fullMap) {
        // For the entire map
        for (let i = 0; i < fullMap.length; i++) {
            // If we found our tile
            if (neighborData.x == fullMap[i].x && neighborData.y == fullMap[i].y) {
                // Give the tile back
                return fullMap[i];
            }
        }
        // No tile exists
        return null;
    }

    static getLayerNeighbors(closedNodes, fullMap) {
        let newNeighbors = [];

        // For every closed node
        for (let i = 0; i < closedNodes.length; i++) {
            // For every neighbor of that closed node
            for (let j = 0; j < closedNodes[i].connections.length; j++) {
                // Get that neighbor
                let currentNeighbor = Pathfinder.getMapNeighbor(closedNodes[i].connections[j], fullMap);
                
                // If the neighbor is not in closed nodes and not already in the new neighbor list and it exists
                if (!(closedNodes.includes(currentNeighbor)) && !(newNeighbors.includes(currentNeighbor)) && currentNeighbor !== null) {
                    // Add it to the list
                    newNeighbors.push(currentNeighbor);
                } 
            }
        }

        return newNeighbors;
    }

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

    static getUnvisitedNeighbors(node, nodeList) {
        let validNeighbors = [];

        if (node === null) {
            return validNeighbors;
        }

        // For each neighbor that node has
        for (let i = 0; i < node.connections.length; i++) {
            // Get the actual tile info
            let currentNeighbor = Pathfinder.getNodeWithCoord(node.connections[i].x, node.connections[i].y, nodeList);
            // If we found something in the unvisited nodes list
            if (currentNeighbor !== null) {
                // Then add it to the list of valid neighbors
                validNeighbors.push(currentNeighbor);
            }
        }
        
        // Give back the list of valid neighbors
        return validNeighbors;
    }

    static getShortestPath(startingTile, targetTile, tableOfPaths) {
        let currentTargetTile = targetTile;
        let shortestPath = [];

        // While we aren't where we started
        while (currentTargetTile != startingTile) {
            // Add our tile to the shortest path
            shortestPath.push(currentTargetTile);

            // Get the previous tile
            currentTargetTile = tableOfPaths.previousNode[tableOfPaths.node.indexOf(currentTargetTile)];
        }

        return shortestPath;
    }

    static getPath(startingTile, targetTile, map) {
        if (!map.includes(targetTile)) {
            return [];
        }
        // Generate Unvisited Nodes
        let unvisitedNodes = [];
        // Don't forget to add in the starting node
        unvisitedNodes.push(startingTile);


        let visitedNodes = [];

        let tableOfPaths = {};
        tableOfPaths.node = [];
        tableOfPaths.shortestPath = [];
        tableOfPaths.previousNode = [];
        
        // For each node
        for (let i = 0; i < map.length; i++) {
            // Add the node to the table
            tableOfPaths.node.push(map[i]);
            // Add its shortest path and set it to infinity
            tableOfPaths.shortestPath.push(Infinity);
            // Add the a null previous node to the previous node
            tableOfPaths.previousNode.push(null);
        }

        // Find the starting node
        let startingNodeIndex = tableOfPaths.node.indexOf(startingTile);
        
        // Set its shortest path to 0
        tableOfPaths.shortestPath[startingNodeIndex] = 0;

        // While we still have nodes to search
        while (unvisitedNodes.length !== 0) {
            // Find the node with the current shortest path that we have not yet visited
            let currentShortestNode = Pathfinder.getCurrentShortestNode(tableOfPaths, unvisitedNodes); 
            
            // Get the neighbors of that node
            let validNeighbors = Pathfinder.getUnvisitedNeighbors(currentShortestNode, tableOfPaths.node);

            // The distance taken to get to our current node
            let distanceToCurrentNode = tableOfPaths.shortestPath[tableOfPaths.node.indexOf(currentShortestNode)];
            
            for (let i = 0; i < validNeighbors.length; i++) {
                // The currently shortest distance to our neighbor
                let currentNeighborDistance = tableOfPaths.shortestPath[tableOfPaths.node.indexOf(validNeighbors[i])];

                // If the distance to our current node + 1 (the cost to any neighbor) is shorter than on the table
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

            // If the unvisited list is empty, get the next layer of neighbors
            if (unvisitedNodes.length === 0) {
                unvisitedNodes = Pathfinder.getLayerNeighbors(visitedNodes, tableOfPaths.node);
            }
        }

        // Calculate the path to the target tile
        return Pathfinder.getShortestPath(startingTile, targetTile, tableOfPaths).reverse();
    }
}