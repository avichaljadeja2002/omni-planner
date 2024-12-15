import { styles } from './styles';

export default function Notes() {
    return (
        <div>
            <div style={{ textAlign: "center" }}>
                <h1>Notes</h1>
                <input type="text" style={{ height: "450px", width: "1500px" }} ></input>
            </div>
            <br />
            <div style={{ textAlign: "right" }}>
                <input type="submit" style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#65558f", borderRadius: 8, flex: 0.45, justifyContent: "center", fontSize: 18, fontWeight: "bold", color: "#eee", marginRight: 150, padding: "15px 300px"}} value="Save"></input>
            </div>
        </div>
    );
}
