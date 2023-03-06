import { AccidentReportResponse } from "../../../api/accidentReportCalls";
import { useTranslation } from "react-i18next";
import { Container, Row } from "react-bootstrap";
import Spinner from "../../fragments/util/Spinner";
import EnumSelect from "../../fragments/forms/api/EnumSelect";
import { EmergencyType } from "../../../api/enumCalls";
import FormCheck from "../../fragments/forms/FormCheck";
import FormControl from "../../fragments/forms/FormControl";
import Date from "../../fragments/forms/api/Date";
import FormTextArea from "../../fragments/forms/FormTextArea";
import NavButton from "../../fragments/navigation/NavButton";

interface ReportParams {
  data: AccidentReportResponse | null
}

// Displays incident report data
const ReportData = (props: Readonly<ReportParams>) => {
	const { t } = useTranslation();

  if (props.data === null) {
    return (
      <Container className="my-5 text-center">
        <Spinner />
      </Container>
    );
  }

	return (
		<Container className="my-3 justify-content-center w-50">
			<h3 className="text-center">{t("Common.Details")}</h3>
      <EnumSelect id="emergencyType" className="my-3" label={t("Report.Type")} enum={EmergencyType} value={props.data.emergencyType} disabled />
      <Row xs="2" className="mb-3">
        <FormCheck id="breathing" label={t("Report.Breathing")} value={props.data.breathing} disabled />
        <FormCheck id="conscious" label={t("Report.Consious")} value={props.data.consciousness} disabled />
      </Row>
      <FormControl id="amountVictims" className="mb-3" label={t("Report.VictimsCount")} value={props.data.victimCount} disabled />
      <FormControl id="bandCode" className="mb-3" label={t("Report.BandCode")} value={props.data.bandCode ?? ""} disabled />
      <Date id="date" className="mb-3" label={t("Report.Date")} value={props.data.date.toString().split("T")[0]} disabled />
      <FormTextArea id="description" className="mb-3" label={t("Report.Description")} value={props.data.description} disabled />
      <FormControl id="address" className="mb-3" label={t("Report.Address")} value={props.data.address} disabled />
      <Row className="justify-content-center mb-3">
        <NavButton to={`/newreport/${props.data.accidentId}`} className="w-25">{t("Common.Edit")}</NavButton>
      </Row>
		</Container>
	);
};

export default ReportData;
