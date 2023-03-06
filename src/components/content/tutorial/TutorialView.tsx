import { TutorialResponse, getTutorials } from "../../../api/tutorialCalls";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CustomCard from "../../fragments/util/Card";
import { Card } from "react-bootstrap";
import Enum from "../../fragments/values/Enum";
import { TutorialType } from "../../../api/enumCalls";
import Rating from "../../fragments/util/Rating";
import { useState, useEffect } from "react";
import ViewLoader from "../../fragments/util/ViewLoader";

interface TutorialCardParams {
  items: TutorialResponse[]
}

// Displays a single tutorial
const TutorialCard = (props: Readonly<TutorialCardParams>) => {
  const { t } = useTranslation();
  const processTitle = (x: string) => x.length > 30 ? x.substring(0, 27) + "..." : x;
  
  return (
    <div className="tutorial-grid">
      {props.items.map(item => (
        <CustomCard className="col tutorial-card" key={item.tutorialId}>
          <Link to={`/tutorial/${item.tutorialId}`} className="w-100 h-100 text-decoration-none text-reset" key={item.tutorialId}>
            <Card.Img variant="top" src={item.thumbnail} alt={t("Common.Thumbnail")} className="img" />
            <Card.Body>
              <Card.Title>{processTitle(item.name)}</Card.Title>
              <p><Enum enum={TutorialType} value={item.tutorialType} /></p>
              <Rating initialValue={item.averageRating} disabled />
            </Card.Body>
          </Link>
        </CustomCard>
      ))}
    </div>
  );
};

// Displays all tutorials
const TutorialView = () => {
  const [items, setItems] = useState<TutorialResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  // Loads data to display
  useEffect(() => {
    const abort = new AbortController();

    getTutorials(abort).then(res => res.json()).then((data: TutorialResponse[]) => {
      if (data) {
        setItems(data);
      }

      setIsLoading(false);
    }).catch(err => {
      if (abort.signal.aborted) {
        return;
      }
      
      console.error(err);
      setIsLoading(false);
    });

    return () => abort.abort();
  }, []);
  
  return (
    <>
      <h1 className="my-3 text-center">{t("Tutorial.Tutorials")}</h1>
      <ViewLoader isLoaded={!isLoading} element={<TutorialCard items={items} />} />
    </>
  );
};

export default TutorialView;
