import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Container } from "native-base";
import Colors from "../../config/colors";
import { Header, OverlayLoader } from "../../component";
import { manageItemType } from "../../services/InventoryManagmentServices";
import AppContext from "../../context/AppContext";
import { getCapitalizeTextWithoutExtraSpaces } from "../../utils/Util";

export default class AddItemCategory extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
      categoryName:
        typeof props.route.params !== "undefined"
          ? props.route.params.categoryName
          : "",
      categoryNameValidationFailed: false,
      showLoader: false,
    };
  }

  gotoBack = () => {
    this.props.navigation.goBack();
  };

  saveData = () => {
    this.setState(
      {
        categoryNameValidationFailed: false,
      },
      () => {
        let { id, categoryName } = this.state;
        if (categoryName.trim().length === 0) {
          this.setState({ categoryNameValidationFailed: true });
          return false;
        } else {
          this.setState({ showLoader: true });
          let reqObj = {
            cid: this.context.userDetails.cid,
            type: getCapitalizeTextWithoutExtraSpaces(categoryName),
          };

          if (parseInt(id) > 0) {
            reqObj.id = id;
          }

          manageItemType(reqObj)
            .then((response) => {
              this.setState(
                {
                  showLoader: false,
                },
                () => {
                  this.gotoBack();
                }
              );
            })
            .catch((error) => {
              this.setState({ showLoader: false });
              console.log(error);
            });
        }
      }
    );
  };

  render = () => (
    <Container>
      <Header
        title={
          parseInt(this.state.id) > 0 ? "Edit Category" : "Create New Category"
        }
      />
      <View style={styles.container}>
        <View
          style={[
            styles.fieldBox,
            this.state.categoryNameValidationFailed
              ? styles.errorFieldBox
              : null,
          ]}
        >
          <Text style={styles.labelName}>Category Name:</Text>
          <TextInput
            multiline
            value={this.state.categoryName}
            onChangeText={(categoryName) => this.setState({ categoryName })}
            style={[styles.textfield, globalStyles.width60]}
            autoCompleteType="off"
            autoCapitalize="words"
            placeholder="Enter Category Name"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={this.saveData}>
          <Text style={styles.textWhite}>Save</Text>
        </TouchableOpacity>
      </View>
      <OverlayLoader visible={this.state.showLoader} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  fieldBox: {
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    flexDirection: "row",
    padding: 5,
    borderRadius: 3,
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    height: "auto",
    justifyContent: "space-between",
  },
  labelName: {
    color: Colors.labelColor,
    // lineHeight: 40,
    fontSize: Colors.lableSize,
    paddingLeft: 4,
    height: "auto",
    paddingVertical: 10,
  },
  textfield: {
    backgroundColor: "#fff",
    height: "auto",

    fontSize: Colors.textSize,
    color: Colors.textColor,
    textAlign: "left",
    padding: 5,
  },
  button: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 10,
    // shadowColor: "#000",
    // shadowOffset: {
    // 	width: 0,
    // 	height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
    borderRadius: 20,
    color: "#fff",
    marginVertical: 10,
  },
  textWhite: {
    color: "#fff",
    fontWeight: "bold",
  },
  errorFieldBox: {
    borderWidth: 1,
    borderColor: Colors.tomato,
  },
});
