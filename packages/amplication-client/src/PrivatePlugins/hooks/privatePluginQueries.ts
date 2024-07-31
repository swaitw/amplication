import { gql } from "@apollo/client";

export const PRIVATE_PLUGINS_FIELDS_FRAGMENT = gql`
  fragment PrivatePluginFields on PrivatePlugin {
    id
    pluginId
    displayName
    description
    enabled
  }
`;

export const GET_PRIVATE_PLUGINS = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  query privatePlugins(
    $where: PrivatePluginWhereInput
    $orderBy: PrivatePluginOrderByInput
  ) {
    privatePlugins(where: $where, orderBy: $orderBy) {
      ...PrivatePluginFields
    }
  }
`;

export const DELETE_PRIVATE_PLUGIN = gql`
  mutation deletePrivatePlugin($where: WhereUniqueInput!) {
    deletePrivatePlugin(where: $where) {
      id
    }
  }
`;

export const CREATE_PRIVATE_PLUGIN = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  mutation createPrivatePlugin($data: PrivatePluginCreateInput!) {
    createPrivatePlugin(data: $data) {
      ...PrivatePluginFields
    }
  }
`;

export const GET_PRIVATE_PLUGIN = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  query privatePlugin($privatePluginId: String!) {
    privatePlugin(where: { id: $privatePluginId }) {
      ...PrivatePluginFields
    }
  }
`;

export const UPDATE_PRIVATE_PLUGIN = gql`
  ${PRIVATE_PLUGINS_FIELDS_FRAGMENT}
  mutation updatePrivatePlugin(
    $data: PrivatePluginUpdateInput!
    $where: WhereUniqueInput!
  ) {
    updatePrivatePlugin(data: $data, where: $where) {
      ...PrivatePluginFields
    }
  }
`;
