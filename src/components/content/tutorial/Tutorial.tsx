import { TutorialResponse, ReviewResponse, getTutorialReviews, getTutorialById, addReview, updateReview, getTutorialsStyles } from "../../../api/tutorialCalls";
import { useState, useEffect } from "react";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useRoles } from "../../../hooks/useAuth";
import { usePopup } from "../../../hooks/usePopup";
import { useAbort } from "../../../hooks/useAbort";
import { useTranslation } from "react-i18next";
import { getUserId, hasPerm, getEmail } from "../../../helpers/authHelper";
import { missingDataError, loadingError, userEmailError, unknownError, networkError } from "../sharedStrings";
import NotLoggedPopup from "../../fragments/popups/NotLoggedPopup";
import { Container, Row, Col, Nav, NavDropdown } from "react-bootstrap";
import { customTheme } from "../../fragments/sharedParams";
import ContentsGenerator from "../../fragments/util/ContentsGenerator";
import ItemLink from "../../fragments/navigation/ItemLink";
import Spinner from "../../fragments/util/Spinner";
import Rating from "../../fragments/util/Rating";
import Error from "../../fragments/forms/Error";
import InnerHtml from "../../fragments/values/InnerHtml";
import { useParams } from "react-router-dom";
import ViewLoader from "../../fragments/util/ViewLoader";

interface TutorialPageParams {
  tutorial: TutorialResponse,
  style: string
}

// Displays tutorial content
const TutorialPage = (props: Readonly<TutorialPageParams>) => {
  const [review, setReview] = useState<ReviewResponse | null>(null);
  const [average, setAverage] = useState(props.tutorial.averageRating);
  const [error, setError] = useState<string | undefined>("");
  const darkMode = useDarkMode();
  const roles = useRoles();
  const popup = usePopup();
  const abort = useAbort();
  const { t } = useTranslation();
  const userId = getUserId();
  const auth = hasPerm(roles, roles);

  // Loads user review
  useEffect(() => {
    setError(undefined);
    const abortUpdate = new AbortController();

    getTutorialReviews(props.tutorial.tutorialId, abortUpdate).then(res => res.json()).then((data: ReviewResponse[]) => {
      if (data) {
        const reviews = data.filter(r => r.reviewer.id === userId);
        setReview(reviews.length > 0 ? reviews[0] : null);
        setError("");
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (!abortUpdate.signal.aborted) {
        console.error(err);
        setError(loadingError);
      }
    });

    return () => abortUpdate.abort();
  }, [props.tutorial.tutorialId, userId, average]);

  // Update average rating when tutorial is updated
  useEffect(() => setAverage(props.tutorial.averageRating), [props.tutorial.averageRating]);

  const processTitle = (x: string | null) => {
    if (x === null) {
      return null;
    }

    return x.length > 33 ? x.substring(0, 30) + "..." : x;
  };

  const updateAverage = () => {
    getTutorialById(props.tutorial.tutorialId, abort).then(res => res.json()).then((data: TutorialResponse) => {
      if (data.tutorialHTML) {
        setAverage(data.averageRating);
      } else {
        console.log(data);
        setError(missingDataError);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setError(loadingError);
      }
    });
  };

  const onReview = () => {
    if (!auth) {
      popup(<NotLoggedPopup redirect="tutorial" />);
    }
  };

  const onReviewChange = (x: number) => {
    if (error === undefined) {
      return;
    }

    const user = getEmail();

    if (user === undefined) {
      console.error(userEmailError);
      return;
    }

    setError(undefined);

    const reviewReq = {
      value: x,
      discription: ""
    };

    (review === null ? addReview(props.tutorial.tutorialId, user, reviewReq, abort) : updateReview(review.reviewId, reviewReq, abort)).then(res => {
      if (res.ok) {
        updateAverage();
      } else {
        console.log(res);
        setError(unknownError);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
        setError(networkError);
      }
    });
  };

  return (
    <Container fluid className="my-5">
      <Row>
        <Col xs={2} className={`contents-${customTheme(darkMode)} radius`}>
          <Nav className="col-md-12 d-none d-md-block lh-lg p-1 h-100">
            <span className="contents">
              <h1>{t("Common.Contents")}</h1>
              <ContentsGenerator selector="h1, h3, h4" result={(ch, index) => (
                <Nav.Item key={index}>
                  <ItemLink to={ch.id}>{processTitle(ch.textContent) ?? "???"}</ItemLink>
                </Nav.Item>
              )} update={props.tutorial.tutorialHTML} />
              <br />
              <NavDropdown.Divider />
              <br />
              <p>{t("Tutorial.Opinion")}</p>
              <Row onClick={onReview} className="justify-content-center text-center">
                {error === undefined ? <Spinner /> :<Rating initialValue={review?.value ?? 0} disabled={!auth} onChange={onReviewChange} />}
              </Row>
              <Error className="mx-1 my-3" error={error} />
            </span>
          </Nav>
        </Col>
        <Col xs={10}>
          <Row className="text-end">
            <Rating initialValue={average} disabled />
          </Row>
          <Row className="justify-content-end mx-1">
            {t("Tutorial.Average")} {average.toFixed(2)}
          </Row>
          <InnerHtml value={props.tutorial.tutorialHTML ?? ""} containerClass="tutorial" style={props.style} />
        </Col>
      </Row>
    </Container>
  );
};

const getPlaceholderTutorial = () => ({
  tutorialId: -1,
  tutorialType: "",
  tutorialHTML: null,
  averageRating: 0,
  name: "",
  thumbnail: ""
}) as TutorialResponse;

// Wrapper component for tutorial page
const Tutorial = () => {
  const [tutorial, setTutorial] = useState(getPlaceholderTutorial());
  const [style, setStyle] = useState("");
  const { tutorialId } = useParams();

  // Loads tutorial content and user review
  useEffect(() => {
    if (tutorialId === undefined) {
      return;
    }

    const abort = new AbortController();

    getTutorialById(parseInt(tutorialId), abort).then(res => res.json()).then((data: TutorialResponse) => {
      if (data.tutorialHTML) {
        setTutorial(data);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
      }
    });

    return () => abort.abort();
  }, [tutorialId]);

  // Loads tutorial styles
  useEffect(() => {
    const abort = new AbortController();

    getTutorialsStyles(abort).then(res => res.text()).then(data => {
      if (data) {
        setStyle(data);
      }
    }).catch(err => {
      if (!abort.signal.aborted) {
        console.error(err);
      }
    });

    return () => abort.abort();
  }, []);

  return <ViewLoader isLoaded={tutorial.tutorialId > 0 && style.length > 0} element={<TutorialPage tutorial={tutorial} style={style} />} />;
};

export default Tutorial;
