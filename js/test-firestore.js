import { db } from "./js/firebase-config.js"; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

async function testFirestore() {
    try {
        console.log("🔥 Testing Firestore connection...");
        const querySnapshot = await getDocs(collection(db, "chapters"));
        querySnapshot.forEach((doc) => {
            console.log(`Chapter: ${doc.id}`);
        });
    } catch (error) {
        console.error("❌ Firestore Error:", error);
    }
}

testFirestore();
