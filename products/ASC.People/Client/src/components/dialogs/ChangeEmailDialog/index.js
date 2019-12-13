import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  toastr,
  ModalDialog,
  Button,
  Text,
  Label,
  EmailInput
} from "asc-web-components";
import { withTranslation, I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import styled from "styled-components";
import { api } from "asc-web-common";
const { sendInstructionsToChangeEmail } = api.people;

const ModalDialogContainer = styled.div`
  .cancel-btn {
    margin-left: 8px;
  }

  .margin-top {
    margin-top: 16px;
  }
`;

class PureChangeEmailDialog extends React.Component {
  constructor(props) {
    super(props);

    const { newEmail, id, language } = props;

    this.state = {
      isEmailValid: true,
      isRequestRunning: false,
      email: newEmail,
      id
    };

    i18n.changeLanguage(language);
  }

  onValidateEmailInput = value => this.setState({ isEmailValid: value });

  onChangeEmailInput = e => this.setState({ email: e.target.value });

  onSendEmailChangeInstructions = () => {
    this.setState({ isRequestRunning: true }, function () {
      sendInstructionsToChangeEmail(this.state.id, this.state.email)
        .then((res) => {
          toastr.success(res);
        })
        .catch((error) => toastr.error(error))
        .finally(() => {
          this.props.onClose();
          this.setState({ isRequestRunning: false });
        });
    })

  }


  render() {
    console.log("ChangeEmailDialog render");
    const { t, visible, newEmail, onClose } = this.props;
    const { isEmailValid, email, isRequestRunning } = this.state;
    const isSendButtonDisabled = !isEmailValid || newEmail.toLowerCase() === email.toLowerCase();

    return (
      <ModalDialogContainer>
        <ModalDialog
          visible={visible}
          onClose={onClose}
          headerContent={t('EmailChangeTitle')}
          bodyContent={
            <>
              <Label htmlFor="new-email" text={t('EnterEmail')} />
              <EmailInput
                className='margin-top'
                id="new-email"
                scale={true}
                isAutoFocussed={true}
                value={email}
                onChange={this.onChangeEmailInput}
                onValidateInput={this.onValidateEmailInput}

              />
              <Text
                className='margin-top'
              >
                {t('EmailActivationDescription')}
              </Text>
            </>
          }
          footerContent={
            <>
              <Button
                key="SendBtn"
                label={t('SendButton')}
                size="medium"
                primary={true}
                onClick={this.onSendEmailChangeInstructions}
                isDisabled={isSendButtonDisabled}
                isLoading={isRequestRunning}
              />
              <Button
                key="CancelBtn"
                label={t('CancelButton')}
                size="medium"
                primary={false}
                onClick={onClose}
                className='cancel-btn'
                isDisabled={isRequestRunning}
              />
            </>
          }
        />
      </ModalDialogContainer>
    );
  }
}


const ChangeEmailDialogContainer = withTranslation()(PureChangeEmailDialog);

const ChangeEmailDialog = props => (
  <I18nextProvider i18n={i18n}>
    <ChangeEmailDialogContainer {...props} />
  </I18nextProvider>
);

ChangeEmailDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.auth.user.cultureName,
  };
}

export default connect(mapStateToProps, {})(withRouter(ChangeEmailDialog));