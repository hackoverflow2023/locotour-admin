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
(async () => {
  const db = firebase.firestore();
  const users = await db.collection("Spaces").get();
  users.forEach(async (user) => {
    console.log(user.id);
    const userData = await db.collection("Renters").doc(user.id).get();
    const { Aadhar, Name } = userData.data();
    const userRooms = await db
      .collection("Spaces")
      .doc(user.id)
      .collection("Rooms")
      .get();
    userRooms.forEach((room) => {
      const data = room.data();
      if (!data.status) {
        document.getElementById("table-rows").innerHTML += `
                                <tr>
                                <td>${data.Name}</td>
                                <td>${Name}</td>
                                <td><a href='${data.lightBill}' target="_blank">View</a></td>
                                <td><a href='${Aadhar}' target="_blank">View</a></td>
                                <td><div class='d-flex justify-content-evenly'><button userData='${userData.id}' room='${room.id}' class='btn btn-success' id='accept-btn'><i class="fa-solid fa-check"></i></button><button id='reject-btn' userData='${userData.id}' room='${room.id}' class='btn btn-danger'><i class="fa-solid fa-xmark"></i></button></div></td>
                            </tr>`;
        document.querySelectorAll("#reject-btn").forEach((btn) =>
          btn.addEventListener("click", (e) => {
            const userId = e.target.getAttribute("userData");
            const roomId = e.target.getAttribute("room");
            console.log(roomId);
            db.collection("Spaces")
              .doc(userId)
              .collection("Rooms")
              .doc(roomId)
              .delete()
              .then(() => {
                alert("Room Deleted");
                  window.location.reload();
              })
              .catch((error) => {
                console.error("Error removing document: ", error);
              });
          })
        );
        document.querySelectorAll("#accept-btn").forEach((btn) =>
          btn.addEventListener("click", (e) => {
            const userId = e.target.getAttribute("userData");
            const roomId = e.target.getAttribute("room");
            db.collection("Spaces")
              .doc(userId)
              .collection("Rooms")
              .doc(roomId)
              .update({
                status: true,
              })
              .then(() => {
                alert("Room Approved");
                window.location.reload();
              })
              .catch((error) => {
                console.error("Error removing document: ", error);
              });
          })
        );
      }
    });
  });
})();
