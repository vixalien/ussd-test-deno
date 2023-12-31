import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import Dialog, { DialogProps } from "./dialog.tsx";
import Input from "./input.tsx";
import Button from "./button.tsx";

const dialog_props = signal<DialogProps>({
  open: false,
});

const phone = signal("+250788666655");
const cb = signal("http://localhost:3001");
const code = signal("49035");
const sessionId = signal(Math.floor(Math.random() * 100000000).toString());

const saved_input = signal("950");

export function Phone() {
  function resetSession() {
    sessionId.value = Math.floor(Math.random() * 100000000).toString();
  }

  const dialog_buttons = {
    both: {
      "cancel": "Cancel",
      "ok": "OK",
    },
    ok: {
      "ok": "OK",
    },
    cancel: {
      "cancel": "Cancel",
    },
  };

  function showLoading() {
    dialog_props.value = {
      open: true,
      content: "Loading...",
      buttons: dialog_buttons.ok,
    };
  }

  function showError(error: string) {
    cancelSession();
    dialog_props.value = {
      open: true,
      content: "Error: " + error,
      buttons: dialog_buttons.ok,
    };
  }

  function makeRequest() {
    showLoading();

    const params = new URLSearchParams();
    params.append("phoneNumber", phone.value);
    params.append("sessionId", sessionId.value);
    params.append("serviceCode", code.value);
    params.append("text", saved_input.value);

    fetch(cb.value, {
      method: "POST",
      body: params,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        parseReturnedSession(res.headers, await res.text());
      }).catch((err) => {
        showError(err.message);
      });
  }

  function cancelSession() {
    resetSession();

    saved_input.value = "950";
    dialog_props.value = {
      open: false,
    };
  }

  function parseReturnedSession(headers: Headers, res: string) {
    if (headers.get("freeflow") == "FC") {
      dialog_props.value = {
        open: true,
        content: res,
        buttons: dialog_buttons.both,
        showInput: true,
        onAction: (action, input) => {
          console.log("action", action);

          if (action === "ok") {
            saved_input.value = input;
            // if (input) {
            //   if (saved_input.value.length !== 0) saved_input.value += "*";
            //   saved_input.value += input;
            // }

            makeRequest();
          } else {
            cancelSession();
          }
        },
      };
    } else if (headers.get("freeflow") == "FB") {
      dialog_props.value = {
        open: true,
        content: res,
        buttons: dialog_buttons.ok,
        onAction: (action) => {
          dialog_props.value = {
            open: false,
          };
        },
      };
    } else {
      showError("Invalid response from server");
    }
  }

  function startSession() {
    if (!phone.value) {
      return showError("Phone number is required");
    }

    if (!cb.value) {
      return showError("Callback URL is required");
    }

    if (!code.value) {
      return showError("Service code is required");
    }

    makeRequest();
  }

  return (
    <div className="w-full">
      <br />
      <Input label="Phone Number" name="phone" type="tel" signal={phone} />
      <Input label="Callback URL" name="cb" signal={cb} />
      <Input label="Service Code" name="code" signal={code} />
      {/* a feature phone-like UI */}
      <div class="button">
        <Button
          text="Dial"
          onClick={startSession}
        />
      </div>
      <Dialog
        {...dialog_props.value}
        onAction={(action, input) => {
          if (action === "ok" && dialog_props.value.showInput) {
            saved_input.value = input;
            // if (input) {
            //   if (saved_input.value.length !== 0) saved_input.value += "*";
            //   saved_input.value += input;
            // }

            makeRequest();
          } else {
            cancelSession();
          }
        }}
      />
    </div>
  );
}
