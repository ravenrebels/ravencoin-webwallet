export enum Events {
  SUSPICION__NEW_BLOCK = "SUSPICION__NEW_BLOCK",
  INFO__TRANSFER_IN_PROCESS = "INFO__TRANSFER_IN_PROCESS",
}

//A naive way to handle Events in the app
export function triggerEvent(event: Events) {
  const eventName = event + "";
  console.log("Dispatch event", eventName);
  document.body.dispatchEvent(new Event(eventName));
}
export function removeEventListener(name: string, listener: any) {
  console.log("Remove event listener", name);
  document.body.removeEventListener(name + "", listener);
}
export function addEventListener(name: string, listener: any) {
  console.log("Adding event listener for", name);

  document.body.addEventListener(name + "", listener);
}
