import React, { ReactElement, useState } from 'react';
import Button from 'terra-button';
import ContentContainer from 'terra-content-container';
import AbstractModal from 'terra-abstract-modal';

import { injectIntl } from 'react-intl';
function App(): ReactElement {
    const [isModal1, setIsModal1] = useState<boolean>(false);
    const [isModal2, setIsModal2] = useState<boolean>(false);
    function onRequestCloseModal1() {
        setIsModal1(true);
    }
    function onRequestCloseModal2() {
        setIsModal2(true);
    }
    function openModal() {
        setIsModal1(true);

        return (
            <div>
                <AbstractModal
                    isOpen={isModal1}
                    style={{
                        height: '300px',
                        width: '300px',
                        borderRadius: '3px',
                    }}
                    title={'Modal 1'}
                    ariaLabel={'Modal 1'}
                    onRequestClose={() => {
                        onRequestCloseModal1();
                    }}
                >
                    <ContentContainer>
                        <div>
                            <Button
                                id={'open2'}
                                aria-label={'Open2'}
                                text={'Open2'}
                                onClick={() => {
                                    openModal2();
                                }}
                            />
                            <Button
                                id={'olose1'}
                                aria-label={'Close1'}
                                text={'Close1'}
                                onClick={() => {
                                    setIsModal1(false);
                                }}
                            />
                        </div>
                    </ContentContainer>
                </AbstractModal>
            </div>
        );
    }

    function openModal2() {
        //setIsModal1(false);
        setIsModal2(true);
        return (
            <div>
                <AbstractModal
                    isOpen={isModal2}
                    style={{
                        height: '300px',
                        width: '300px',
                        borderRadius: '3px',
                    }}
                    title={'Modal 2'}
                    ariaLabel={'Modal 2'}
                    onRequestClose={() => {
                        onRequestCloseModal2();
                    }}
                    zIndex='7000'
                >
                    <ContentContainer>
                        <div>
                            <p> this is modal 2</p>
                            <Button
                                id={'closeModal2'}
                                aria-label={'Close2'}
                                text={'CloseModal2'}
                                onClick={() => {
                                    closeModal2();
                                }}
                            />
                        </div>
                    </ContentContainer>
                </AbstractModal>
            </div>
        );
    }

    function closeModal2() {
        setIsModal2(false);
    }
    return (
        <>
            <Button
                id={'open'}
                aria-label={'Open'}
                text={'Open'}
                onClick={() => {
                    openModal();
                }}
            />
            <div>
                <AbstractModal
                    isOpen={isModal1}
                    style={{
                        height: '300px',
                        width: '300px',
                        borderRadius: '3px',
                    }}
                    title={'Modal 1'}
                    ariaLabel={'Modal 1'}
                    onRequestClose={() => {
                        onRequestCloseModal1();
                    }}
                >
                    <ContentContainer>
                        <div>
                            <Button
                                id={'open2'}
                                aria-label={'Open2'}
                                text={'Open2'}
                                onClick={() => {
                                    openModal2();
                                }}
                            />
                            <Button
                                id={'olose1'}
                                aria-label={'Close1'}
                                text={'Close1'}
                                onClick={() => {
                                    setIsModal1(false);
                                }}
                            />
                        </div>
                    </ContentContainer>
                </AbstractModal>
            </div>

            <div>
                <AbstractModal
                    isOpen={isModal2}
                    style={{
                        height: '300px',
                        width: '300px',
                        borderRadius: '3px',
                    }}
                    title={'Modal 2'}
                    ariaLabel={'Modal 2'}
                    onRequestClose={() => {
                        onRequestCloseModal2();
                    }}
                    zIndex='7000'
                >
                    <ContentContainer>
                        <div>
                            <p style={{ color: 'blue' }}> this is modal 2</p>
                            <Button
                                id={'closeModal2'}
                                aria-label={'Close2'}
                                text={'CloseModal2'}
                                onClick={() => {
                                    closeModal2();
                                }}
                            />
                        </div>
                    </ContentContainer>
                </AbstractModal>
            </div>
        </>
    );
}

export default injectIntl(App);
