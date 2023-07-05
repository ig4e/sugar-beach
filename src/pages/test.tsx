import { Media } from "@prisma/client";

interface MediaForm {
  media: Media[];
}

function Test() {
  // useEffect(() => {
  //   if (window) {
  //     const moyasar = window.Moyasar;

  //     moyasar.init({
  //       element: "#my-form",
  //       amount: 1000,
  //       currency: "SAR",
  //       description: "Coffee Order #1",
  //       publishable_api_key: "pk_test_AQpxBV31a29qhkhUYFYUFjhwllaDVrxSq5ydVNui",
  //       callback_url: "https://moyasar.com/thanks",
  //       methods: ["creditcard"],
  //     });
  //   }
  // }, []);

  return (
    <>
      {/* <Head></Head> */}
      <div id={"my-form"}></div>
    </>
  );
}

export default Test;
