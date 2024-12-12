import {
  DataGridColumn,
  DataGridFilters,
  Snackbar,
  Toggle,
} from "@amplication/ui/design-system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyNodeChanges,
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import GraphControls from "../../Components/GraphComponents/GraphControls";
import GraphToolbar from "../../Components/GraphComponents/GraphToolbar";
import GraphToolbarItem from "../../Components/GraphComponents/GraphToolbarItem";
import useCustomPropertiesMap from "../../CustomProperties/hooks/useCustomPropertiesMap";
import * as models from "../../models";
import useMessage from "../../util/useMessage";
import {
  columnsWithProperties,
  RESOURCE_LIST_COLUMNS,
} from "../CatalogDataColumns";
import "./CatalogGraph.scss";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import useCatalogGraph from "./hooks/useCatalogGraph";
import { applyAutoLayout } from "./layout";
import GroupNode from "./nodes/GroupNode";
import ResourceNode from "./nodes/ResourceNode";
import { Node, NodePayloadWithPayloadType } from "./types";
import { CatalogGroupBySelector } from "./hooks/CatalogGroupBySelector";

export const CLASS_NAME = "catalog-graph";
const REACT_FLOW_CLASS_NAME = "reactflow-wrapper";
const MESSAGE_AUTO_HIDE_DURATION = 3000;

const simpleNodeTypes = {
  resource: ResourceNode,
  group2: GroupNode,
};

const edgeTypes = {
  relationSimple: simpleRelationEdge,
};

export default function CatalogGraph() {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const { message, messageType, showMessage, removeMessage } = useMessage();

  const {
    nodes,
    setNodes,
    edges,
    onEdgesChange,
    searchPhraseChanged,
    setSelectRelatedNodes,
    setFilter,
    setGroupByFields,
  } = useCatalogGraph({
    onMessage: showMessage,
  });

  const { customPropertiesMap } = useCustomPropertiesMap();

  const columnsWithAllProps = useMemo<DataGridColumn<models.Resource>[]>(() => {
    return columnsWithProperties(
      RESOURCE_LIST_COLUMNS,
      Object.values(customPropertiesMap)
    );
  }, [customPropertiesMap]);

  const fitViewTimerRef = useRef(null);

  const fitToView = useCallback(
    (delayBeforeStart = 100) => {
      if (reactFlowInstance) {
        if (delayBeforeStart > 0) {
          fitViewTimerRef.current = setTimeout(() => {
            reactFlowInstance.fitView({ duration: 1000 });
          }, delayBeforeStart);
        } else {
          reactFlowInstance.fitView({ duration: 1000 });
        }
      }
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    // Clear the timeout ref when the component unmounts
    return () => clearTimeout(fitViewTimerRef.current);
  }, []);

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges<NodePayloadWithPayloadType>(
        changes,
        nodes
      );
      setNodes(updatedNodes as Node[]);
    },
    [nodes, setNodes]
  );

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      if (!instance) return;
      setReactFlowInstance(instance);
    },
    [setReactFlowInstance]
  );

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(nodes, edges);
    setNodes(updatedNodes);
    fitToView();
  }, [nodes, edges, setNodes, fitToView]);

  const onNodeClick = useCallback(
    async (event: React.MouseEvent, node: Node) => {
      if (!node.data.selectRelatedNodes) return;
      setSelectRelatedNodes(node);
    },
    [setSelectRelatedNodes]
  );

  return (
    <div className={CLASS_NAME}>
      <>
        <div className={`${CLASS_NAME}__container`}>
          <div className={`${CLASS_NAME}__side_toolbar`}>
            <GraphControls
              onArrangeNodes={onArrangeNodes}
              reactFlowInstance={reactFlowInstance}
            />
          </div>
          <div className={`${CLASS_NAME}__body`}>
            <GraphToolbar searchPhraseChanged={searchPhraseChanged}>
              <GraphToolbarItem>
                <DataGridFilters
                  columns={columnsWithAllProps}
                  onChange={setFilter}
                />
              </GraphToolbarItem>
              <GraphToolbarItem>
                <CatalogGroupBySelector onChange={setGroupByFields} />
              </GraphToolbarItem>
            </GraphToolbar>

            <div className={REACT_FLOW_CLASS_NAME}>
              <ReactFlow
                onInit={onInit}
                nodes={nodes}
                edges={edges}
                fitView
                nodeTypes={simpleNodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionMode={ConnectionMode.Loose}
                onNodeClick={onNodeClick}
                proOptions={{ hideAttribution: true }}
                minZoom={0.1}
                panOnScroll
                selectionKeyCode={null}
                elevateNodesOnSelect={false}
              >
                <Background color="grey" />
              </ReactFlow>
            </div>
          </div>
          <Snackbar
            open={Boolean(message)}
            message={message}
            messageType={messageType}
            autoHideDuration={MESSAGE_AUTO_HIDE_DURATION}
            onClose={removeMessage}
          />
        </div>
      </>
    </div>
  );
}
