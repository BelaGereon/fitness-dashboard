import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useCallback } from "react";
import { useFitnessWeeks } from "../data/FitnessWeeksDataProvider";
import { downloadWeekExport } from "../data/download/download";

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { weeks } = useFitnessWeeks();

  const handleDownload = useCallback(() => {
    downloadWeekExport(weeks);
  }, [weeks]);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <InsightsRoundedIcon />
        <Typography
          component="h2"
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: "600" }}
        >
          Download your data
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: "8px" }}>
          Export your data in JSON format for further analysis with the click of
          a button.
        </Typography>
        <Button
          variant="contained"
          size="small"
          color="primary"
          endIcon={<ChevronRightRoundedIcon />}
          fullWidth={isSmallScreen}
          onClick={handleDownload}
        >
          Download data
        </Button>
      </CardContent>
    </Card>
  );
}
