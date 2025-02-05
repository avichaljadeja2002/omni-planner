import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  topBar: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
    paddingTop: 10,
    marginBottom: 20,
  },
  noteContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  addContainer: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  bigContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    height: 450,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  noteHeader: {
    alignItems: 'center',
  },
  calendarHeader: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 18,
    color: "#9b59b6",
    marginBottom: 15,
  },
  addSectionHeader: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
  },
  addViewSectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  bullet: {
    fontSize: 36,
    color: "#9b59b6",
    marginRight: 10,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#FEF7FF",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 35,
    height: 35,
    backgroundColor: "#9b59b6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 18,
    color: "#555",
  },
  inLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inLineDescription: {
    display: "flex",
    flexDirection: "row",
    height: 'auto',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: 'center',
  },
  bigInput: {
    flex: 1,
    height: 80,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingBottom: 20,
  },
  dropdown: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  centerButton: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    height: 250,
    flexGrow: 1,
  },
  field: {
    marginBottom: 15,
  },
  icon: {
    borderRadius: 25,
    height: 60,
    width: 60,
    backgroundColor: "#65558F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  newText: {
    color: '#eee',
    top: -5,
    fontSize: 14,
    fontWeight: 'bold'
  },
  taskicon: {
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: "#EADDFF",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 15,
},
  saveCancel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 10,
    width: 120,
    height: 50,
    borderColor: "black",
  },
  saveText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#eee"
  },
  cancelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#65558f"
  },
  saveCancelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 30,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#65558f",
    borderWidth: 2,
    borderRadius: 8,
    flex: 0.45,
    justifyContent: "center",
  },
  noteSaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65558f',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 50,
    justifyContent: 'center',
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#65558f",
    borderRadius: 8,
    flex: 0.45,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    alignItems: "flex-start",
    width: '26%',
  },
  linkButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: '75%',
    marginTop: 0,
    borderRadius: 8,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateTimeInLine: {
    marginLeft: 10,
    width: 'auto',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: "#ccc",
  },
  loginPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  loginPageInput: {
    height: 40,
    width: "80%",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 25,
    width: "20%",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginPageNonheaderText: {
    marginBottom: 10,
    textAlign: "left",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  fixedButton: {
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  smallButton: {
    marginLeft: 20,
  },
  smallIcon: {
    borderRadius: 20,
    height: 40,
    width: 40,
    backgroundColor: "#65558F",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonSave: {
    backgroundColor: "#28a745",
  },
  buttonDiscard: {
    backgroundColor: "#dc3545",
  },
  buttonCancel: {
    backgroundColor: "#6c757d",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    alignSelf: 'center',
  },
  authPageNonheaderText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  authPageInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },

  switchText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginTop: 20
  },
  authPage: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
    padding: 5,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#6A0DAD',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#6A0DAD',
    fontWeight: 'bold',
  },
  toggleActiveText: {
    color: 'purple',
  },
  authButton: {
    backgroundColor: '#ff6600', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    width: '100%',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trashButton: {
    
  }
});
