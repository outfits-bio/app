import { BaseModal, BaseModalProps } from './BaseModal';
import { Button } from '../Button';

export const BetaFeatureNoticeModal = (props: BaseModalProps) => {
    return <BaseModal {...props}>
        <div className='flex flex-col gap-2'>
            <h1 className='text-2xl font-black font-clash'>This feature is in Beta</h1>

            <p className='text-sm text-secondary-text w-full sm:w-96'>
                This feature is currently in beta, so you may experience bugs or issues. If you do, please report them to us via our Bug Report form, and if you have any suggestions, please let us know via our Feedback form.
            </p>

            <div className='flex w-full gap-2'>
                <div className='w-full'>
                    <Button variant={'outline'} centerItems onClick={() => props.setIsOpen(false)}>Close</Button>
                </div>
            </div>
        </div>
    </BaseModal>
}