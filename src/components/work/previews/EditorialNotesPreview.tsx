import editorialImageFour from "./assets/editorial-4.jpg";
import editorialImageOne from "./assets/editorial-1.jpg";
import editorialImageThree from "./assets/editorial-3.jpg";
import editorialImageTwo from "./assets/editorial-2.jpg";
import "./editorial-notes.css";

const editorialNotes = [
  {
    slug: "find-the-signal",
    title: "Find the signal.",
    description:
      "Klyro brings scattered priorities into focus, so the next move is easier to see.",
    image: editorialImageOne,
    imageAlt: "A blurred blue silhouette emerging through light",
    shape: "square",
  },
  {
    slug: "momentum-needs-direction",
    title: "Momentum needs direction",
    description:
      "Speed means little without a shared horizon. Keep ownership and progress visible as work moves.",
    image: editorialImageTwo,
    imageAlt: "A dark silhouette standing before a grainy sunset",
    shape: "portrait",
  },
  {
    slug: "protect-the-focus",
    title: "Protect the focus",
    description:
      "Clear boundaries give deep work room to happen without leaving the team in the dark.",
    image: editorialImageThree,
    imageAlt: "A blurred figure raising a glowing hand",
    shape: "landscape",
  },
  {
    slug: "let-busywork-fall-away",
    title: "Let busywork fall away",
    description:
      "Automate the repeatable work and give your attention back to the decisions that matter.",
    image: editorialImageFour,
    imageAlt: "A falling silhouette surrounded by grainy color",
    shape: "square",
  },
] as const;

export function EditorialNotesPreview() {
  return (
    <section
      id="editorial-notes-demo"
      className="editorial-notes"
      aria-labelledby="editorial-notes-title"
    >
      <div className="editorial-notes__inner">
        <header className="editorial-notes__header">
          <h2 id="editorial-notes-title">
            Notes on focus, flow, <br />
            and work that moves.
          </h2>
          <a href="#editorial-notes-grid">View all</a>
        </header>

        <div id="editorial-notes-grid" className="editorial-notes__grid">
          {editorialNotes.map((note, index) => (
            <article
              className={`editorial-note editorial-note--${note.shape}`}
              key={note.slug}
            >
              <div className="editorial-note__image-wrap">
                <img
                  src={note.image}
                  alt={note.imageAlt}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <a href={`#${note.slug}`}>Read article</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
