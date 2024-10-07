import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
    paddingTop: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subHeaderText: {
    fontSize: 18,
    color: "#9b59b6",
    marginBottom: 15,
  },
  sectionHeader: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    marginBottom: 10,
  },
  dateTime: {
    display: 'flex',
    flexDirection: "column",
    width: '80%',
    gap: 10,
    height: 100
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
    justifyContent: 'center', // Centering content vertically
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
    flexGrow: 0,
  },
  fixedButton: {
    position: "absolute",
    right: 10,
    top: 10,
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
  saveCancelText: {
    fontSize: 18,
    fontWeight: "bold",
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
    backgroundColor: "#f8d7da",
    borderRadius: 8,
    flex: 0.45,
    justifyContent: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    flex: 0.45,
    justifyContent: "center",
  },
  inputText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginRight: 10,
  },
});
