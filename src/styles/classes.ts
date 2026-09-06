import * as stylex from "@stylexjs/stylex";
import { styles } from "./site.stylex";

export type XStyle = stylex.StyleXStyles<
  Record<string, string | number | null>
>;
export type StyledProps<T> = T & { xstyle?: XStyle };

const markers = {
  appAdminDashboardPageStyle1: "sx-appAdminDashboardPageStyle1",
  appAdminDashboardPageStyle2: "sx-appAdminDashboardPageStyle2",
  appAdminDashboardPageStyle3: "sx-appAdminDashboardPageStyle3",
  appAdminDashboardPageStyle4: "sx-appAdminDashboardPageStyle4 ui-text-defined",
  appAdminDashboardPageStyle5: "sx-appAdminDashboardPageStyle5",
  appAdminDashboardPageStyle6: "sx-appAdminDashboardPageStyle6",
  appAdminDashboardPageStyle8: "sx-appAdminDashboardPageStyle8",
  appAdminDashboardPageStyle9: "sx-appAdminDashboardPageStyle9 ui-text-defined",
  appAdminDashboardPageStyle10:
    "sx-appAdminDashboardPageStyle10 ui-text-defined",
  appAdminDashboardPageStyle12: "sx-appAdminDashboardPageStyle12",
  appAdminDashboardPageStyle13: "sx-appAdminDashboardPageStyle13",
  appAdminDashboardPageStyle14:
    "sx-appAdminDashboardPageStyle14 ui-text-defined",
  appAdminDashboardPageStyle16: "sx-appAdminDashboardPageStyle16",
  appAdminDashboardPageStyle17: "sx-appAdminDashboardPageStyle17",
  appAdminOrganizersAddPageStyle2: "sx-appAdminOrganizersAddPageStyle2",
  appAdminOrganizersAddPageStyle5: "sx-appAdminOrganizersAddPageStyle5",
  appAdminOrganizersAddPageStyle6: "sx-appAdminOrganizersAddPageStyle6",
  appAdminOrganizersPageStyle10:
    "sx-appAdminOrganizersPageStyle10 ui-text-defined",
  appAdminOrganizersPageStyle11:
    "sx-appAdminOrganizersPageStyle11 ui-text-defined",
  appAdminOrganizersPageStyle12:
    "sx-appAdminOrganizersPageStyle12 ui-text-defined",
  appAdminParticipantsPageStyle1:
    "sx-appAdminParticipantsPageStyle1 ui-text-defined",
  appAdminParticipantsPageStyle5: "sx-appAdminParticipantsPageStyle5",
  appAdminParticipantsPageStyle6: "sx-appAdminParticipantsPageStyle6",
  appAdminParticipantsPageStyle7:
    "sx-appAdminParticipantsPageStyle7 ui-text-defined",
  appAdminParticipantsPageStyle8: "sx-appAdminParticipantsPageStyle8",
  appAdminParticipantsPageStyle9:
    "sx-appAdminParticipantsPageStyle9 ui-text-defined",
  appAdminRoomsPageStyle15: "sx-appAdminRoomsPageStyle15",
  appAdminRoomsPageStyle16: "sx-appAdminRoomsPageStyle16",
  appAdminTeamsIdPageStyle3: "sx-appAdminTeamsIdPageStyle3",
  appAdminTeamsIdPageStyle7: "sx-appAdminTeamsIdPageStyle7",
  appAdminTeamsIdPageStyle9: "sx-appAdminTeamsIdPageStyle9",
  appAdminTeamsIdPageStyle10: "sx-appAdminTeamsIdPageStyle10 ui-text-defined",
  appAdminTeamsIdPageStyle11: "sx-appAdminTeamsIdPageStyle11 ui-text-defined",
  appAdminTeamsIdPageStyle25: "sx-appAdminTeamsIdPageStyle25",
  appAdminTeamsIdPageStyle26: "sx-appAdminTeamsIdPageStyle26",
  appAdminTeamsIdPageStyle28: "sx-appAdminTeamsIdPageStyle28",
  appAdminTeamsIdPageStyle29: "sx-appAdminTeamsIdPageStyle29",
  appAdminTeamsIdPageStyle30: "sx-appAdminTeamsIdPageStyle30",
  appAdminTeamsIdPageStyle31: "sx-appAdminTeamsIdPageStyle31 ui-text-defined",
  appAdminTeamsAddPageStyle2: "sx-appAdminTeamsAddPageStyle2",
  appAdminTeamsAddPageStyle7: "sx-appAdminTeamsAddPageStyle7",
  appAdminTeamsAddPageStyle8: "sx-appAdminTeamsAddPageStyle8",
  appAdminTeamsAddPageStyle12: "sx-appAdminTeamsAddPageStyle12",
  appAdminTeamsAddPageStyle13: "sx-appAdminTeamsAddPageStyle13",
  appLayoutStyle1: "sx-appLayoutStyle1",
  appLoginPageStyle1: "sx-appLoginPageStyle1",
  appLoginPageStyle2: "sx-appLoginPageStyle2",
  appLoginPageStyle3: "sx-appLoginPageStyle3",
  appLoginPageStyle4: "sx-appLoginPageStyle4 ui-text-defined",
  appLoginPageStyle5: "sx-appLoginPageStyle5",
  appLoginPageStyle6: "sx-appLoginPageStyle6 ui-text-defined",
  appPageStyle1: "sx-appPageStyle1",
  appPageStyle2: "sx-appPageStyle2",
  appPageStyle3: "sx-appPageStyle3 ui-text-defined",
  componentsDashboardLayoutStyle1: "sx-componentsDashboardLayoutStyle1",
  componentsDashboardLayoutStyle2: "sx-componentsDashboardLayoutStyle2",
  componentsDashboardLayoutStyle3: "sx-componentsDashboardLayoutStyle3",
  componentsDashboardLayoutStyle4:
    "sx-componentsDashboardLayoutStyle4 ui-text-defined",
  componentsDashboardLayoutStyle5:
    "sx-componentsDashboardLayoutStyle5 ui-text-defined",
  componentsDashboardLayoutStyle7: "sx-componentsDashboardLayoutStyle7",
  componentsDashboardLayoutStyle8: "sx-componentsDashboardLayoutStyle8",
  componentsDashboardLayoutStyle20:
    "sx-componentsDashboardLayoutStyle20 ui-text-defined",
  componentsDashboardLayoutStyle22: "sx-componentsDashboardLayoutStyle22",
  componentsDashboardLayoutStyle23: "sx-componentsDashboardLayoutStyle23",
  componentsDashboardLayoutStyle24: "sx-componentsDashboardLayoutStyle24",
  componentsDashboardLayoutStyle25: "sx-componentsDashboardLayoutStyle25",
  componentsDashboardLayoutStyle26: "sx-componentsDashboardLayoutStyle26",
  componentsDashboardLayoutStyle45: "sx-componentsDashboardLayoutStyle45",
  componentsDashboardLayoutStyle46:
    "sx-componentsDashboardLayoutStyle46 ui-border-b",
  componentsDashboardLayoutStyle48:
    "sx-componentsDashboardLayoutStyle48 ui-text-defined",
  componentsDashboardLayoutStyle49: "sx-componentsDashboardLayoutStyle49",
  componentsDashboardLayoutStyle50:
    "sx-componentsDashboardLayoutStyle50 ui-text-defined",
  componentsDashboardLayoutStyle51: "sx-componentsDashboardLayoutStyle51",
  componentsDashboardLayoutStyle52: "sx-componentsDashboardLayoutStyle52",
  componentsDashboardStatsStyle1: "sx-componentsDashboardStatsStyle1",
  componentsDashboardStatsStyle2: "sx-componentsDashboardStatsStyle2",
  componentsDashboardStatsStyle3:
    "sx-componentsDashboardStatsStyle3 ui-text-defined",
  componentsDashboardStatsStyle4:
    "sx-componentsDashboardStatsStyle4 ui-text-defined",
  componentsDashboardStatsStyle5:
    "sx-componentsDashboardStatsStyle5 ui-text-defined",
  componentsDashboardStatsStyle6:
    "sx-componentsDashboardStatsStyle6 ui-text-defined",
  componentsDataTableStyle1: "sx-componentsDataTableStyle1",
  componentsDataTableStyle2: "sx-componentsDataTableStyle2",
  componentsDataTableStyle4: "sx-componentsDataTableStyle4 ui-text-defined",
  componentsDataTableStyle5: "sx-componentsDataTableStyle5",
  componentsLoginFormStyle1: "sx-componentsLoginFormStyle1",
  componentsLoginFormStyle2: "sx-componentsLoginFormStyle2 ui-text-defined",
  componentsLoginFormStyle4: "sx-componentsLoginFormStyle4 ui-text-defined",
  componentsLoginFormStyle5: "sx-componentsLoginFormStyle5",
  componentsLoginFormStyle6: "sx-componentsLoginFormStyle6",
  componentsLoginFormStyle8: "sx-componentsLoginFormStyle8",
  componentsLoginFormStyle9: "sx-componentsLoginFormStyle9 ui-text-defined",
  componentsLoginFormStyle11: "sx-componentsLoginFormStyle11",
  alertvariantdefault: "sx-alertvariantdefault ui-text-defined",
  alertvariantdestructive: "sx-alertvariantdestructive ui-text-defined",
  alertBase: "sx-alertBase ui-text-defined",
  componentsUiAlertStyle1: "sx-componentsUiAlertStyle1",
  componentsUiAlertStyle2: "sx-componentsUiAlertStyle2 ui-text-defined",
  buttonvariantdefault: "sx-buttonvariantdefault ui-text-defined",
  buttonvariantdestructive: "sx-buttonvariantdestructive ui-text-defined",
  buttonvariantoutline: "sx-buttonvariantoutline ui-text-defined",
  buttonvariantsecondary: "sx-buttonvariantsecondary ui-text-defined",
  buttonvariantghost: "sx-buttonvariantghost ui-text-defined",
  buttonvariantlink: "sx-buttonvariantlink ui-text-defined",
  buttonsizedefault: "sx-buttonsizedefault",
  buttonsizesm: "sx-buttonsizesm",
  buttonsizelg: "sx-buttonsizelg",
  buttonsizeicon: "sx-buttonsizeicon ui-size-defined",
  buttonBase: "sx-buttonBase ui-text-defined",
  componentsUiCardStyle1: "sx-componentsUiCardStyle1 ui-text-defined",
  componentsUiCardStyle2: "sx-componentsUiCardStyle2",
  componentsUiCardStyle3: "sx-componentsUiCardStyle3",
  componentsUiCardStyle5: "sx-componentsUiCardStyle5",
  componentsUiCardStyle6: "sx-componentsUiCardStyle6",
  componentsUiCardStyle7: "sx-componentsUiCardStyle7",
  componentsUiCommandStyle1: "sx-componentsUiCommandStyle1 ui-text-defined",
  componentsUiCommandStyle2: "sx-componentsUiCommandStyle2",
  componentsUiCommandStyle3: "sx-componentsUiCommandStyle3",
  componentsUiCommandStyle4: "sx-componentsUiCommandStyle4",
  componentsUiCommandStyle5: "sx-componentsUiCommandStyle5 ui-border-b",
  componentsUiCommandStyle6: "sx-componentsUiCommandStyle6 ui-size-defined",
  componentsUiCommandStyle7: "sx-componentsUiCommandStyle7 ui-text-defined",
  componentsUiCommandStyle8: "sx-componentsUiCommandStyle8",
  componentsUiCommandStyle9: "sx-componentsUiCommandStyle9 ui-text-defined",
  componentsUiCommandStyle10: "sx-componentsUiCommandStyle10 ui-text-defined",
  componentsUiCommandStyle11: "sx-componentsUiCommandStyle11",
  componentsUiCommandStyle12: "sx-componentsUiCommandStyle12 ui-text-defined",
  componentsUiCommandStyle13: "sx-componentsUiCommandStyle13 ui-text-defined",
  componentsUiDialogStyle1: "sx-componentsUiDialogStyle1",
  componentsUiDialogStyle2: "sx-componentsUiDialogStyle2",
  componentsUiDialogStyle3: "sx-componentsUiDialogStyle3",
  componentsUiDialogStyle5: "sx-componentsUiDialogStyle5 ui-text-defined",
  componentsUiDialogStyle6: "sx-componentsUiDialogStyle6",
  componentsUiDialogStyle7: "sx-componentsUiDialogStyle7 ui-text-defined",
  componentsUiDropdownMenuStyle1:
    "sx-componentsUiDropdownMenuStyle1 ui-text-defined",
  componentsUiDropdownMenuStyle2:
    "sx-componentsUiDropdownMenuStyle2 ui-text-defined",
  componentsUiDropdownMenuStyle3:
    "sx-componentsUiDropdownMenuStyle3 ui-text-defined",
  componentsUiDropdownMenuStyle4:
    "sx-componentsUiDropdownMenuStyle4 ui-size-defined",
  componentsUiDropdownMenuStyle5:
    "sx-componentsUiDropdownMenuStyle5 ui-size-defined",
  componentsUiDropdownMenuStyle8:
    "sx-componentsUiDropdownMenuStyle8 ui-size-defined",
  componentsUiDropdownMenuStyle9:
    "sx-componentsUiDropdownMenuStyle9 ui-text-defined",
  componentsUiDropdownMenuStyle10: "sx-componentsUiDropdownMenuStyle10",
  componentsUiDropdownMenuStyle12:
    "sx-componentsUiDropdownMenuStyle12 ui-text-defined",
  componentsUiDropdownMenuStyle13:
    "sx-componentsUiDropdownMenuStyle13 ui-size-defined",
  componentsUiDropdownMenuStyle14:
    "sx-componentsUiDropdownMenuStyle14 ui-text-defined",
  componentsUiFormStyle2: "sx-componentsUiFormStyle2",
  componentsUiFormStyle4: "sx-componentsUiFormStyle4 ui-text-defined",
  componentsUiInputStyle1: "sx-componentsUiInputStyle1 ui-text-defined",
  componentsUiLabelStyle1: "sx-componentsUiLabelStyle1 ui-text-defined",
  scrollVertical: "sx-scrollVertical",
  scrollHorizontal: "sx-scrollHorizontal ui-border-t",
  componentsUiScrollAreaStyle1: "sx-componentsUiScrollAreaStyle1",
  componentsUiScrollAreaStyle2:
    "sx-componentsUiScrollAreaStyle2 ui-size-defined",
  componentsUiScrollAreaStyle3: "sx-componentsUiScrollAreaStyle3",
  componentsUiSelectStyle1: "sx-componentsUiSelectStyle1 ui-text-defined",
  componentsUiSelectStyle2: "sx-componentsUiSelectStyle2 ui-text-defined",
  componentsUiSelectStyle3: "sx-componentsUiSelectStyle3",
  componentsUiSelectStyle4: "sx-componentsUiSelectStyle4",
  componentsUiSelectStyle5: "sx-componentsUiSelectStyle5 ui-text-defined",
  componentsUiSelectStyle6: "sx-componentsUiSelectStyle6 ui-size-defined",
  componentsUiSelectStyle7: "sx-componentsUiSelectStyle7 ui-text-defined",
  componentsUiSelectStyle8: "sx-componentsUiSelectStyle8 ui-text-defined",
  componentsUiSelectStyle9: "sx-componentsUiSelectStyle9 ui-size-defined",
  componentsUiSelectStyle11: "sx-componentsUiSelectStyle11",
  componentsUiSelectStyle12: "sx-componentsUiSelectStyle12",
  componentsUiSwitchStyle1: "sx-componentsUiSwitchStyle1 ui-peer",
  componentsUiSwitchStyle2: "sx-componentsUiSwitchStyle2 ui-size-defined",
  componentsUiTableStyle1: "sx-componentsUiTableStyle1",
  componentsUiTableStyle2: "sx-componentsUiTableStyle2 ui-text-defined",
  componentsUiTableStyle3: "sx-componentsUiTableStyle3",
  componentsUiTableStyle4: "sx-componentsUiTableStyle4",
  componentsUiTableStyle5: "sx-componentsUiTableStyle5 ui-border-t",
  componentsUiTableStyle6: "sx-componentsUiTableStyle6 ui-border-b",
  componentsUiTableStyle7: "sx-componentsUiTableStyle7 ui-text-defined",
  componentsUiTableStyle8: "sx-componentsUiTableStyle8",
  componentsUiTableStyle9: "sx-componentsUiTableStyle9 ui-text-defined",
};

/** Compose atomic styles with the semantic markers used by compound selectors. */
export function styleClass(
  key: keyof typeof styles,
  override?: stylex.StyleXStyles<Record<string, string | number | null>>,
) {
  return [stylex.props(styles[key], override).className, markers[key]]
    .filter(Boolean)
    .join(" ");
}
