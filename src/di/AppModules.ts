import {UserRepositoryImpl} from '@/src/data/repository/UserRepositoryImpl';
import {AuthRepositoryImpl} from '@/src/data/repository/AuthRepositoryImpl';
import {EventRepositoryImpl} from '@/src/data/repository/EventRepositoryImpl';
import {OrderRepositoryImpl} from '@/src/data/repository/OrderRepositoryImpl';
import {TicketRepositoryImpl} from '@/src/data/repository/TicketRepositoryImpl';
import {PaymentRepositoryImpl} from '@/src/data/repository/PaymentRepositoryImpl';
import {UserRepository} from '@/src/domain/repository/UserRepository';
import {AuthRepository} from '@/src/domain/repository/AuthRepository';
import {EventRepository} from '@/src/domain/repository/EventRepository';
import {OrderRepository} from '@/src/domain/repository/OrderRepository';
import {TicketRepository} from '@/src/domain/repository/TicketRepository';
import {PaymentRepository} from '@/src/domain/repository/PaymentRepository';
import {SignUpUseCase} from '@/src/domain/use-case/auth/SignUpUseCase';
import {SignInUseCase} from '@/src/domain/use-case/auth/SignInUseCase';
import {SignOutUseCase} from '@/src/domain/use-case/auth/SignOutUseCase';
import {ResetPasswordUseCase} from '@/src/domain/use-case/auth/ResetPasswordUseCase';
import {CreateUserUseCase} from '@/src/domain/use-case/user/CreateUser';
import {GetUserByIdUseCase} from '@/src/domain/use-case/user/GetUserByIdUseCase';
import {GetUserByEmailUseCase} from '@/src/domain/use-case/user/GetUserByEmailUseCase';
import {UpdateUserUseCase} from '@/src/domain/use-case/user/UpdateUserUseCase';
import {DeleteUserUseCase} from '@/src/domain/use-case/user/DeleteUserUseCase';
import {ListAllUsersUseCase} from '@/src/domain/use-case/user/ListAllUsersUseCase';
import {CreateEventUseCase} from '@/src/domain/use-case/event/CreateEventUseCase';
import {GetEventByIdUseCase} from '@/src/domain/use-case/event/GetEventByIdUseCase';
import {ListEventsUseCase} from '@/src/domain/use-case/event/ListEventsUseCase';
import {CreateOrderUseCase} from '@/src/domain/use-case/order/CreateOrderUseCase';
import {GetUserOrdersUseCase} from '@/src/domain/use-case/order/GetUserOrdersUseCase';
import {CancelOrderUseCase} from '@/src/domain/use-case/order/CancelOrderUseCase';
import {ValidateTicketUseCase} from '@/src/domain/use-case/ticket/ValidateTicketUseCase';
import {GetOrderTicketsUseCase} from '@/src/domain/use-case/ticket/GetOrderTicketsUseCase';
import {initializeFirebase} from "@/src/firebase/app";
import {SignWithProviderUseCase} from "@/src/domain/use-case/auth/SignWithProviderUseCase";
import {GetCurrentUserUseCase} from "@/src/domain/use-case/auth/GetCurrentUserUseCase";
import {AuthFirebaseDataSource} from "@/src/data/datasource/firebase/AuthFirebaseDataSource";
import {UserFirebaseDataSource} from "@/src/data/datasource/firebase/UserFirebaseDataSource";
import {EventFirebaseDataSource} from "@/src/data/datasource/firebase/EventFirebaseDataSource";
import {OrderFirebaseDataSource} from "@/src/data/datasource/firebase/OrderFirebaseDataSource";
import {EventTicketRepository} from "@/src/domain/repository/EventTicketRepository";
import {TicketFirebaseDataSource} from "@/src/data/datasource/firebase/TicketFirebaseDataSource";
import {EventTicketRepositoryImpl} from "@/src/data/repository/EventTicketRepositoryImpl";
import {EventTicketFirebaseDataSource} from "@/src/data/datasource/firebase/EventTicketFirebaseDataSource";

class AppModules {
    private userRepository: UserRepository;
    private authRepository: AuthRepository;
    private eventRepository: EventRepository;
    private eventTicketRepository: EventTicketRepository;
    private orderRepository: OrderRepository;
    private ticketRepository: TicketRepository;
    private paymentRepository: PaymentRepository;

    public signUpUseCase: SignUpUseCase;
    public signInUseCase: SignInUseCase;
    public signOutUseCase: SignOutUseCase;
    public resetPasswordUseCase: ResetPasswordUseCase;
    public signWithProviderUseCase: SignWithProviderUseCase;
    public getCurrentUserUseCase: GetCurrentUserUseCase;

    public createUserUseCase: CreateUserUseCase;
    public getUserByIdUseCase: GetUserByIdUseCase;
    public getUserByEmailUseCase: GetUserByEmailUseCase;
    public updateUserUseCase: UpdateUserUseCase;
    public deleteUserUseCase: DeleteUserUseCase;
    public listAllUsersUseCase: ListAllUsersUseCase;

    public createEventUseCase: CreateEventUseCase;
    public getEventByIdUseCase: GetEventByIdUseCase;
    public listEventsUseCase: ListEventsUseCase;

    public createOrderUseCase: CreateOrderUseCase;
    public getUserOrdersUseCase: GetUserOrdersUseCase;
    public cancelOrderUseCase: CancelOrderUseCase;

    public validateTicketUseCase: ValidateTicketUseCase;
    public getOrderTicketsUseCase: GetOrderTicketsUseCase;

    constructor() {
        const firebaseApp = initializeFirebase()
        this.authRepository = new AuthRepositoryImpl(
            new AuthFirebaseDataSource(
                firebaseApp.auth, firebaseApp.firestore
            )
        );
        this.userRepository = new UserRepositoryImpl(new UserFirebaseDataSource(firebaseApp.firestore));
        this.eventRepository = new EventRepositoryImpl(new EventFirebaseDataSource(firebaseApp.firestore));
        this.eventTicketRepository = new EventTicketRepositoryImpl(new EventTicketFirebaseDataSource(firebaseApp.firestore));
        this.orderRepository = new OrderRepositoryImpl(new OrderFirebaseDataSource(firebaseApp.firestore));
        this.ticketRepository = new TicketRepositoryImpl(new TicketFirebaseDataSource(firebaseApp.firestore));
        this.paymentRepository = new PaymentRepositoryImpl();

        this.signUpUseCase = new SignUpUseCase(this.authRepository, this.userRepository);
        this.signInUseCase = new SignInUseCase(this.authRepository);
        this.signOutUseCase = new SignOutUseCase(this.authRepository);
        this.resetPasswordUseCase = new ResetPasswordUseCase(this.authRepository, this.userRepository);
        this.signWithProviderUseCase = new SignWithProviderUseCase(this.authRepository);
        this.getCurrentUserUseCase = new GetCurrentUserUseCase(this.authRepository);

        this.createUserUseCase = new CreateUserUseCase(this.userRepository);
        this.getUserByIdUseCase = new GetUserByIdUseCase(this.userRepository);
        this.getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);
        this.updateUserUseCase = new UpdateUserUseCase(this.userRepository);
        this.deleteUserUseCase = new DeleteUserUseCase(this.userRepository, this.orderRepository);
        this.listAllUsersUseCase = new ListAllUsersUseCase(this.userRepository);

        this.createEventUseCase = new CreateEventUseCase(this.eventRepository, this.eventTicketRepository);
        this.getEventByIdUseCase = new GetEventByIdUseCase(this.eventRepository, this.eventTicketRepository);
        this.listEventsUseCase = new ListEventsUseCase(this.eventRepository);

        this.createOrderUseCase = new CreateOrderUseCase(
            this.orderRepository,
            this.eventRepository,
            this.ticketRepository,
            this.eventTicketRepository
        );
        this.getUserOrdersUseCase = new GetUserOrdersUseCase(this.orderRepository);
        this.cancelOrderUseCase = new CancelOrderUseCase(
            this.orderRepository,
            this.ticketRepository,
            this.eventRepository,
            this.eventTicketRepository
        );

        this.validateTicketUseCase = new ValidateTicketUseCase(this.ticketRepository);
        this.getOrderTicketsUseCase = new GetOrderTicketsUseCase(
            this.ticketRepository,
            this.orderRepository
        );
    }
}

export const appModules = new AppModules();
