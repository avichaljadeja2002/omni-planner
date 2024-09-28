import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: "#ffffff",
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
    textAlign: 'center',
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  inputContainer:{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    paddingBottom: 20,
  },  
  centerButton: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatList: {
    height: 250,
    flexGrow: 0
  },
  fixedButton: {
    position: 'absolute',
    right: 30,
    bottom: 30
  },
  icon: {
    borderRadius: 50,
    height: 60,
    width: 60,
    backgroundColor: '#65558F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskicon: {
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: '#EADDFF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  saveCancel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 50,
    borderColor: 'black',
  },
  saveText: {
    fontSize: 20,
    paddingRight: 5,
  },
  cancelText: {
    fontSize: 18,
    paddingRight: 4,
  },
  saveCancelContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
  },
  inputText: { 
    width: 50, 
    fontSize: 20 }

});
