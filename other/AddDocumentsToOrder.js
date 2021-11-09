import React from "react";
import { makeStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Row, Col, Container } from "reactstrap";
import { CreateButton, CancelButton } from "../ui-components/Buttons";
import { useMutation, useApolloClient, gql } from "@apollo/client";

const GET_ORDER_DOCUMENTS = gql`
  query GetOrderDocuments($orderId: Int!) {
    orderheaderDocuments(filter: { orderheaderId: { equalTo: $orderId } }) {
      nodes {
        document {
          headerDocumentFile
          id
          title
        }
      }
    }
  }
`;

const GET_ALL_DOCUMENTS = gql`
  query GetAllDocuments {
    documents {
      nodes {
        headerDocumentFile
        id
        title
      }
    }
  }
`;
const ADD_DOCUMENT_TO_ORDERHEADER = gql`
  mutation AddDocumentToOrderheader($orderId: Int!, $documentId: Int!) {
    createOrderheaderDocument(
      input: {
        orderheaderDocument: {
          orderheaderId: $orderId
          documentId: $documentId
        }
      }
    ) {
      orderheaderDocument {
        document {
          headerDocumentFile
          id
          title
        }
      }
    }
  }
`;

const REMOVE_DOCUMENT_FROM_ORDER = gql`
  mutation RemoveDocumentFromOrder($orderId: Int!, $documentId: Int!) {
    deleteOrderheaderDocument(
      input: { orderheaderId: $orderId, documentId: $documentId }
    ) {
      clientMutationId
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: "auto",
    /// backgroundColor: "gray",
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
    backgroundColor: "hsl(222,37%,75%)",
  },
  list: {
    width: 200,
    height: 430,
    backgroundColor: "hsl(222,37%,89%)",
    fontWeight: "bold",
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
}));

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function TransferList({ hideModal, orderId }) {
  const client = useApolloClient();
  //const [allDocs, setAllDocs] = React.useState([]);

  const { orderheaderDocuments } = client.readQuery({
    query: GET_ORDER_DOCUMENTS,
    variables: { orderId: Number(orderId) },
  });

  /* const { data, loading } = useQuery(GET_ALL_DOCUMENTS, {
    variables: { orderId: Number(orderId) },
    onCompleted: ({ documents }) => setAllDocs(documents.nodes),
  }); */

  const { documents } = client.readQuery({
    query: GET_ALL_DOCUMENTS,
    variables: { orderId: Number(orderId) },
  });

  const existingDocs = orderheaderDocuments.nodes.map((item) => item.document);
  const allDocs = documents.nodes;

  const choices = allDocs.filter((el) => {
    return existingDocs.every((f) => {
      return f.id !== el.id;
    });
  });
  const existing = existingDocs.length > 0 ? existingDocs : [];

  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(choices);
  const [right, setRight] = React.useState(existing);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const [saveAddtions] = useMutation(ADD_DOCUMENT_TO_ORDERHEADER, {
    refetchQueries: [
      {
        query: GET_ORDER_DOCUMENTS,
        variables: { orderId: orderId },
        fetchPolicy: "network-only",
      },
    ],
    awaitRefetchQueries: true,
  });
  const [saveDeletions] = useMutation(REMOVE_DOCUMENT_FROM_ORDER, {
    refetchQueries: [
      {
        query: GET_ORDER_DOCUMENTS,
        variables: { orderId: orderId },
        fetchPolicy: "network-only",
      },
    ],
    awaitRefetchQueries: true,
  });

  const handleSubmit = () => {
    const documentsToAdd = right.filter((el) => {
      return existing.every((f) => {
        return f.id !== el.id;
      });
    });
    const documentsToRemove = existing.filter((el) => {
      return right.every((f) => {
        return f.id !== el.id;
      });
    });

    documentsToAdd.length > 0 && documentsToAdd.forEach(handleSaveAdditions);
    documentsToRemove && documentsToRemove.forEach(handleSaveDeletions);
    client.writeFragment({
      id: `OrderheaderWithValue:${orderId}`,
      fragment: gql`
        fragment documentCount on OrderheaderWithValue {
          documentCount
        }
      `,
      data: {
        documentCount: right.length.toString(),
      },
    });
    hideModal();
  };

  const handleSaveAdditions = (data) => {
    saveAddtions({ variables: { orderId: orderId, documentId: data.id } });
  };

  const handleSaveDeletions = (data) => {
    saveDeletions({ variables: { orderId: orderId, documentId: data.id } });
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.title}-label`;

          return (
            <ListItem
              key={value.id}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.title} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Container>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className={classes.root}
        //  style={{ backgroundColor: "gray" }}
      >
        <Grid item>{customList("Choices", left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList("Chosen", right)}</Grid>
      </Grid>
      <hr />
      <Row>
        <Col>
          <CreateButton type="button" onClick={handleSubmit}>
            SAVE CHANGES
          </CreateButton>
        </Col>
        <Col>
          <CancelButton type={"button"} onClick={hideModal} fullWidth>
            CLOSE
          </CancelButton>
        </Col>
      </Row>
    </Container>
  );
}
