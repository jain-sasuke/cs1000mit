import Head from "next/head";
import { Accordion, Card } from "react-bootstrap";

export default function Home({ data }) {
  let result = [];
  if (process.browser) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    Array.from(doc.querySelectorAll("h2")).forEach((i) => {
      const text = i.textContent;
      const isTextValid = !(
        i.textContent.includes("Conc") || i.textContent.includes("Whol")
      );
      if (isTextValid) {
        let loop = true;
        let siblings = [];
        let nextSibling = i.nextElementSibling;
        while (loop) {
          if (
            nextSibling.nodeName === "DIV" &&
            nextSibling.className === "youtube-responsive-container"
          ) {
            const iframe = document.createElement("iframe");
            iframe.setAttribute(
              "src",
              nextSibling.querySelector("iframe").getAttribute("data-ezsrc")
            );
            siblings.push(iframe);
          } else {
            if (
              nextSibling.nodeName !== "DIV" &&
              nextSibling.innerHTML !== "" &&
              nextSibling.innerHTML !== "&nbsp;" &&
              !nextSibling.innerHTML.includes(" -->&nbsp;") &&
              !nextSibling.innerHTML.includes("</span>&nbsp;")
            ) {
              siblings.push(nextSibling);
            }
          }
          console.log(siblings);
          nextSibling = nextSibling.nextElementSibling;
          if (nextSibling.nodeName === "H2") {
            loop = false;
          }
        }
        siblings = siblings
          .map((i) => {
            if (i.outerHTML !== "<p></p>" && i.outerHTML !== "<p>&nbsp;</p>") {
              return i.outerHTML;
            }
          })
          .join("");
        result.push({
          title: text,
          siblings,
        });
      }
    });
  }
  return (
    <div className="bg-dark p-3 min-vh-100">
      <Head>
        <title>CS1000</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center mb-3">
        <h1 className="text-secondary">
          Ad free version of{" "}
          <small>
            <em>
              This is The Entire Computer Science Curriculum in 1000 YouTube
              Videos...
            </em>
          </small>
        </h1>
      </div>
      <Accordion variant="dark" className="shadow-lg">
        {result.map((i, index) => (
          <Card key={index} bg="dark" text="white">
            <Accordion.Toggle
              as={Card.Header}
              variant="link"
              eventKey={index.toString()}
            >
              <div className="title">{i.title}</div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
              <div
                dangerouslySetInnerHTML={{ __html: i.siblings }}
                className="p-3 siblings"
              ></div>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
      <div className="text-center my-3 d-flex justify-content-center">
        <a
          href="https://laconicml.com/computer-science-curriculum-youtube-videos/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
        >
          Reference
        </a>
        <a
          href="https://github.com/tpkahlon/cs1000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white ml-3"
        >
          Source
        </a>
      </div>
    </div>
  );
}

Home.getInitialProps = async () => {
  const r = await fetch(
    `https://laconicml.com/computer-science-curriculum-youtube-videos/`
  );
  const j = await r.text();
  return {
    data: j,
  };
};