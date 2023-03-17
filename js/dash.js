const db = firebase.firestore();
const user = JSON.parse(localStorage.getItem("user"));
console.log(user);
if (!user) {
  window.location.href = "./index.html";
}
document.getElementById("logout-btn").addEventListener("click", () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.removeItem("user");
      window.location.href = "./index.html";
    })
    .catch((error) => {
      console.log(error);
    });
});

db.collection("Spaces")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((spaceDoc) => {
      db.collection("Spaces")
        .doc(spaceDoc.id)
        .collection("Rooms")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((roomDoc) => {
            db.collection("Spaces")
              .doc(spaceDoc.id)
              .collection("Rooms")
              .doc(roomDoc.id)
              .get()
              .then((doc) => {
                const data = doc.data();
                if (!data.status) {
                  document.getElementById("table-rows").innerHTML += `
                        <tr>
                        <td>${data.Name}</td>
                        <td>${data.Landmark_ID}</td>
                        <td><a href='${data.LightBill_Url}' target="_blank">View</a></td>
                        <td><a href='${data.Aadhar}' target="_blank">View</a></td>
                    </tr>`;
                }
              })
              .catch((error) => {
                console.log("Error getting document:", error);
              });
          });
        });
    });
  });
