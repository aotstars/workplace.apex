import { signOutTemporary } from "../auth.js";

export function account() {
  $("#logout").on("click", async function () {
    signOutTemporary();
    window.location.href = "index.html";

    //  MQ 04232021 - for next iteration
    // try {
    //   const out = await signOutTemporary();
    //   if (out) {
    //     window.location.href = "index.html";
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  });
}
